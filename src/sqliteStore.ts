import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { ObsCredential, PlaybackSession, StateMutator } from "./domain.js";
import { migrateState } from "./store.js";

export class SqliteStore {
  declare filePath: string;
  declare legacyPath: string | null;
  declare db: DatabaseSync | null;
  declare loaded: boolean;

  constructor(filePath: string, { legacyPath = null }: { legacyPath?: string | null } = {}) {
    this.filePath = filePath;
    this.legacyPath = legacyPath;
    this.db = null;
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return this.read();
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    this.db = new DatabaseSync(this.filePath);
    this.db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;");
    this.migrate();
    this.importLegacyState();
    this.loaded = true;
    return this.read();
  }

  migrate() {
    const version = Number(asRecord(this.db.prepare("PRAGMA user_version").get()).user_version);
    if (version >= 1) return;
    this.db.exec(`
      BEGIN;
      CREATE TABLE app_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        document TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE playback_sessions (
        id TEXT PRIMARY KEY,
        viewer_id TEXT NOT NULL,
        viewer_name TEXT NOT NULL,
        broadcast_id TEXT,
        location_id TEXT NOT NULL,
        transport TEXT,
        candidate_type TEXT,
        started_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL,
        ended_at TEXT,
        watch_seconds REAL NOT NULL DEFAULT 0,
        startup_ms INTEGER,
        buffering_ms INTEGER NOT NULL DEFAULT 0,
        buffering_count INTEGER NOT NULL DEFAULT 0,
        reconnect_count INTEGER NOT NULL DEFAULT 0,
        fallback_reason TEXT,
        terminal_error TEXT,
        ip TEXT,
        user_agent TEXT
      );
      CREATE INDEX playback_sessions_age ON playback_sessions(last_seen_at);
      CREATE INDEX playback_sessions_broadcast ON playback_sessions(broadcast_id);
      CREATE TABLE playback_daily (
        day TEXT NOT NULL,
        location_id TEXT NOT NULL,
        transport TEXT NOT NULL,
        sessions INTEGER NOT NULL,
        viewer_seconds REAL NOT NULL,
        buffering_seconds REAL NOT NULL,
        failures INTEGER NOT NULL,
        PRIMARY KEY(day, location_id, transport)
      );
      CREATE TABLE auth_sessions (
        token_hash TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL
      );
      CREATE TABLE oauth_attempts (
        state_hash TEXT PRIMARY KEY,
        verifier TEXT NOT NULL,
        nonce TEXT NOT NULL,
        return_to TEXT NOT NULL,
        expires_at TEXT NOT NULL
      );
      CREATE TABLE obs_credentials (
        id TEXT PRIMARY KEY,
        unit_name TEXT NOT NULL,
        port INTEGER NOT NULL UNIQUE,
        salt TEXT NOT NULL,
        secret TEXT NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
      );
      PRAGMA user_version=1;
      COMMIT;
    `);
  }

  importLegacyState() {
    if (this.db.prepare("SELECT 1 FROM app_state WHERE id=1").get()) return;
    let state = null;
    if (this.legacyPath && fs.existsSync(this.legacyPath)) {
      const legacy = fs.readFileSync(this.legacyPath, "utf8").trim();
      if (legacy) state = JSON.parse(legacy);
      const backup = `${this.legacyPath}.pre-sqlite`;
      if (!fs.existsSync(backup)) fs.copyFileSync(this.legacyPath, backup);
    }
    this.db.prepare("INSERT INTO app_state(id, document, updated_at) VALUES(1, ?, ?)")
      .run(JSON.stringify(migrateState(state || {})), new Date().toISOString());
  }

  async read() {
    if (!this.loaded) await this.load();
    const state = migrateState(parseStateDocument(this.db.prepare("SELECT document FROM app_state WHERE id=1").get()));
    return structuredClone(state);
  }

  async update<T>(mutator: StateMutator<T>): Promise<T> {
    if (!this.loaded) await this.load();
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const state = migrateState(parseStateDocument(this.db.prepare("SELECT document FROM app_state WHERE id=1").get()));
      const result = await mutator(state);
      this.db.prepare("UPDATE app_state SET document=?, updated_at=? WHERE id=1")
        .run(JSON.stringify(state), new Date().toISOString());
      this.db.exec("COMMIT");
      return result ?? structuredClone(state) as T;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  upsertPlaybackSession(session: PlaybackSession) {
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO playback_sessions(
        id, viewer_id, viewer_name, broadcast_id, location_id, transport, candidate_type,
        started_at, last_seen_at, ended_at, watch_seconds, startup_ms, buffering_ms,
        buffering_count, reconnect_count, fallback_reason, terminal_error, ip, user_agent
      ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        transport=excluded.transport, candidate_type=excluded.candidate_type,
        last_seen_at=excluded.last_seen_at, ended_at=excluded.ended_at,
        watch_seconds=excluded.watch_seconds, startup_ms=COALESCE(excluded.startup_ms, startup_ms),
        buffering_ms=excluded.buffering_ms, buffering_count=excluded.buffering_count,
        reconnect_count=excluded.reconnect_count, fallback_reason=excluded.fallback_reason,
        terminal_error=excluded.terminal_error
    `).run(
      session.id || crypto.randomUUID(), session.viewerId, session.viewerName,
      session.broadcastId || null, session.locationId, session.transport || null,
      session.candidateType || null, session.startedAt || now, now, session.endedAt || null,
      Number(session.watchSeconds || 0), session.startupMs ?? null,
      Number(session.bufferingMs || 0), Number(session.bufferingCount || 0),
      Number(session.reconnectCount || 0), session.fallbackReason || null,
      session.terminalError || null, session.ip || null, session.userAgent || null
    );
  }

  aggregatePlaybackSessions(referenceDate = new Date()) {
    const cutoff = new Date(referenceDate.getTime() - 90 * 86400_000).toISOString();
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare(`
        INSERT INTO playback_daily(day, location_id, transport, sessions, viewer_seconds, buffering_seconds, failures)
        SELECT substr(started_at, 1, 10), location_id, COALESCE(transport, 'unknown'), COUNT(*),
          SUM(watch_seconds), SUM(buffering_ms) / 1000.0,
          SUM(CASE WHEN terminal_error IS NULL THEN 0 ELSE 1 END)
        FROM playback_sessions WHERE last_seen_at < ?
        GROUP BY substr(started_at, 1, 10), location_id, COALESCE(transport, 'unknown')
        ON CONFLICT(day, location_id, transport) DO UPDATE SET
          sessions=sessions+excluded.sessions,
          viewer_seconds=viewer_seconds+excluded.viewer_seconds,
          buffering_seconds=buffering_seconds+excluded.buffering_seconds,
          failures=failures+excluded.failures
      `).run(cutoff);
      const result = this.db.prepare("DELETE FROM playback_sessions WHERE last_seen_at < ?").run(cutoff);
      this.db.exec("COMMIT");
      return Number(result.changes);
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  activePlaybackCount(broadcastId: string | null, referenceDate = new Date()) {
    if (!broadcastId) return 0;
    const cutoff = new Date(referenceDate.getTime() - 45_000).toISOString();
    return Number(asRecord(this.db.prepare("SELECT COUNT(*) AS count FROM playback_sessions WHERE broadcast_id=? AND last_seen_at>=?").get(broadcastId, cutoff)).count);
  }

  listObsCredentials(): ObsCredential[] {
    return this.db.prepare("SELECT id, unit_name AS unitName, port, salt, secret, enabled, created_at AS createdAt FROM obs_credentials ORDER BY unit_name")
      .all()
      .map(obsCredentialFromRow);
  }

  createObsCredential({ unitName, port }: { unitName: string; port: number }) {
    const id = crypto.randomUUID();
    const password = crypto.randomBytes(18).toString("base64url");
    const salt = crypto.randomBytes(24).toString("base64");
    const secret = crypto.createHash("sha256").update(password + salt).digest("base64");
    this.db.prepare("INSERT INTO obs_credentials(id, unit_name, port, salt, secret, created_at) VALUES(?, ?, ?, ?, ?, ?)")
      .run(id, String(unitName).trim().slice(0, 80), Number(port), salt, secret, new Date().toISOString());
    return { id, unitName, port: Number(port), password };
  }
}

function parseStateDocument(row: unknown): unknown {
  const document = asRecord(row).document;
  if (typeof document !== "string") throw new Error("Application state row is missing its document");
  return JSON.parse(document) as unknown;
}

function obsCredentialFromRow(value: unknown): ObsCredential {
  const row = asRecord(value);
  return {
    id: String(row.id || ""),
    unitName: String(row.unitName || ""),
    port: Number(row.port),
    salt: String(row.salt || ""),
    secret: String(row.secret || ""),
    enabled: row.enabled === true || Number(row.enabled) === 1,
    createdAt: String(row.createdAt || "")
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
