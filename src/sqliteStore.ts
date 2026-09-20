import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type {
  BroadcastSchedule,
  ObsCredential,
  PlaybackSession,
  PersonAccess,
  ScheduleException,
  StateMutator,
  Unit,
} from "./domain.js";
import { migrateState } from "./store.js";

export class SqliteStore {
  declare filePath: string;
  declare legacyPath: string | null;
  declare private database: DatabaseSync | null;

  get db(): DatabaseSync {
    if (!this.database) throw new Error("SQLite store is not loaded");
    return this.database;
  }
  declare loaded: boolean;

  constructor(filePath: string, { legacyPath = null }: { legacyPath?: string | null } = {}) {
    this.filePath = filePath;
    this.legacyPath = legacyPath;
    this.database = null;
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return this.read();
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    this.database = new DatabaseSync(this.filePath);
    this.db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;");
    this.migrate();
    this.importLegacyState();
    this.loaded = true;
    return this.read();
  }

  migrate() {
    const version = Number(asRecord(this.db.prepare("PRAGMA user_version").get()).user_version);
    if (version < 1) {
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
    if (version < 2) {
      this.db.exec(`
        BEGIN;
        CREATE TABLE units (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('ward', 'branch', 'stake', 'other')),
          parent_unit_id TEXT REFERENCES units(id),
          archived_at TEXT
        );
        CREATE TABLE broadcast_schedules (
          id TEXT PRIMARY KEY,
          public_id TEXT NOT NULL UNIQUE,
          channel_id TEXT NOT NULL,
          unit_id TEXT NOT NULL REFERENCES units(id),
          title TEXT NOT NULL,
          kind TEXT NOT NULL CHECK(kind IN ('sacrament-meeting', 'stake-conference', 'other')),
          time_zone TEXT NOT NULL,
          recurrence TEXT NOT NULL CHECK(recurrence IN ('weekly', 'once')),
          weekday INTEGER CHECK(weekday BETWEEN 0 AND 6),
          local_date TEXT,
          local_start_time TEXT NOT NULL,
          duration_minutes INTEGER NOT NULL CHECK(duration_minutes > 0),
          enabled INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL,
          CHECK(
            (recurrence = 'weekly' AND weekday IS NOT NULL AND local_date IS NULL) OR
            (recurrence = 'once' AND weekday IS NULL AND local_date IS NOT NULL)
          )
        );
        CREATE INDEX broadcast_schedules_channel ON broadcast_schedules(channel_id, enabled);
        CREATE TABLE schedule_exceptions (
          schedule_id TEXT NOT NULL REFERENCES broadcast_schedules(id) ON DELETE CASCADE,
          local_date TEXT NOT NULL,
          action TEXT NOT NULL CHECK(action = 'cancel'),
          PRIMARY KEY(schedule_id, local_date)
        );
        PRAGMA user_version=2;
        COMMIT;
      `);
    }
    if (version < 3) {
      this.db.exec(`
        BEGIN;
        CREATE TABLE people (
          email TEXT PRIMARY KEY COLLATE NOCASE,
          role TEXT NOT NULL CHECK(role IN ('broadcaster', 'administrator')),
          enabled INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE person_units (
          email TEXT NOT NULL COLLATE NOCASE REFERENCES people(email) ON DELETE CASCADE,
          unit_id TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
          PRIMARY KEY(email, unit_id)
        );
        CREATE INDEX person_units_unit ON person_units(unit_id);
        PRAGMA user_version=3;
        COMMIT;
      `);
    }
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
    this.db
      .prepare("INSERT INTO app_state(id, document, updated_at) VALUES(1, ?, ?)")
      .run(JSON.stringify(migrateState(state || {})), new Date().toISOString());
  }

  async read() {
    if (!this.loaded) await this.load();
    const state = migrateState(
      parseStateDocument(this.db.prepare("SELECT document FROM app_state WHERE id=1").get()),
    );
    return structuredClone(state);
  }

  async update<T>(mutator: StateMutator<T>): Promise<T> {
    if (!this.loaded) await this.load();
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const state = migrateState(
        parseStateDocument(this.db.prepare("SELECT document FROM app_state WHERE id=1").get()),
      );
      const result = await mutator(state);
      this.db
        .prepare("UPDATE app_state SET document=?, updated_at=? WHERE id=1")
        .run(JSON.stringify(state), new Date().toISOString());
      this.db.exec("COMMIT");
      return result ?? (structuredClone(state) as T);
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  upsertPlaybackSession(session: PlaybackSession) {
    const now = new Date().toISOString();
    this.db
      .prepare(`
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
    `)
      .run(
        session.id || crypto.randomUUID(),
        session.viewerId,
        session.viewerName,
        session.broadcastId || null,
        session.locationId,
        session.transport || null,
        session.candidateType || null,
        session.startedAt || now,
        now,
        session.endedAt || null,
        Number(session.watchSeconds || 0),
        session.startupMs ?? null,
        Number(session.bufferingMs || 0),
        Number(session.bufferingCount || 0),
        Number(session.reconnectCount || 0),
        session.fallbackReason || null,
        session.terminalError || null,
        session.ip || null,
        session.userAgent || null,
      );
  }

  aggregatePlaybackSessions(referenceDate = new Date()) {
    const cutoff = new Date(referenceDate.getTime() - 90 * 86400_000).toISOString();
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db
        .prepare(`
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
      `)
        .run(cutoff);
      const result = this.db
        .prepare("DELETE FROM playback_sessions WHERE last_seen_at < ?")
        .run(cutoff);
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
    return Number(
      asRecord(
        this.db
          .prepare(
            "SELECT COUNT(*) AS count FROM playback_sessions WHERE broadcast_id=? AND last_seen_at>=?",
          )
          .get(broadcastId, cutoff),
      ).count,
    );
  }

  listObsCredentials(): ObsCredential[] {
    return this.db
      .prepare(
        "SELECT id, unit_name AS unitName, port, salt, secret, enabled, created_at AS createdAt FROM obs_credentials ORDER BY unit_name",
      )
      .all()
      .map(obsCredentialFromRow);
  }

  createObsCredential({ unitName, port }: { unitName: string; port: number }) {
    const id = crypto.randomUUID();
    const password = crypto.randomBytes(18).toString("base64url");
    const salt = crypto.randomBytes(24).toString("base64");
    const secret = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("base64");
    this.db
      .prepare(
        "INSERT INTO obs_credentials(id, unit_name, port, salt, secret, created_at) VALUES(?, ?, ?, ?, ?, ?)",
      )
      .run(
        id,
        String(unitName).trim().slice(0, 80),
        Number(port),
        salt,
        secret,
        new Date().toISOString(),
      );
    return { id, unitName, port: Number(port), password };
  }

  listUnits(): Unit[] {
    return this.db
      .prepare(
        "SELECT id, slug, name, type, parent_unit_id AS parentUnitId, archived_at AS archivedAt FROM units ORDER BY name",
      )
      .all()
      .map(unitFromRow);
  }

  createUnit(unit: Omit<Unit, "id" | "archivedAt"> & { id?: string }): Unit {
    const value: Unit = { ...unit, id: unit.id || crypto.randomUUID(), archivedAt: null };
    this.db
      .prepare("INSERT INTO units(id, slug, name, type, parent_unit_id) VALUES(?, ?, ?, ?, ?)")
      .run(value.id, value.slug, value.name, value.type, value.parentUnitId);
    return value;
  }

  updateUnit(id: string, unit: Omit<Unit, "id" | "archivedAt">): Unit | null {
    const result = this.db
      .prepare("UPDATE units SET slug = ?, name = ?, type = ?, parent_unit_id = ? WHERE id = ?")
      .run(unit.slug, unit.name, unit.type, unit.parentUnitId, id);
    if (result.changes === 0) return null;
    return this.listUnits().find((value) => value.id === id) || null;
  }

  listBroadcastSchedules(): BroadcastSchedule[] {
    return this.db
      .prepare(`
        SELECT id, public_id AS publicId, channel_id AS channelId, unit_id AS unitId,
          title, kind, time_zone AS timeZone, recurrence, weekday, local_date AS localDate,
          local_start_time AS localStartTime, duration_minutes AS durationMinutes, enabled
        FROM broadcast_schedules ORDER BY title
      `)
      .all()
      .map(broadcastScheduleFromRow);
  }

  createBroadcastSchedule(
    schedule: Omit<BroadcastSchedule, "id" | "publicId"> & { id?: string; publicId?: string },
  ): BroadcastSchedule {
    const value: BroadcastSchedule = {
      ...schedule,
      id: schedule.id || crypto.randomUUID(),
      publicId: schedule.publicId || crypto.randomBytes(9).toString("base64url"),
    };
    this.db
      .prepare(`
        INSERT INTO broadcast_schedules(
          id, public_id, channel_id, unit_id, title, kind, time_zone, recurrence,
          weekday, local_date, local_start_time, duration_minutes, enabled, created_at
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        value.id,
        value.publicId,
        value.channelId,
        value.unitId,
        value.title,
        value.kind,
        value.timeZone,
        value.recurrence,
        value.weekday,
        value.localDate,
        value.localStartTime,
        value.durationMinutes,
        value.enabled ? 1 : 0,
        new Date().toISOString(),
      );
    return value;
  }

  updateBroadcastSchedule(
    id: string,
    schedule: Omit<BroadcastSchedule, "id" | "publicId">,
  ): BroadcastSchedule | null {
    const result = this.db
      .prepare(`
        UPDATE broadcast_schedules SET
          channel_id = ?, unit_id = ?, title = ?, kind = ?, time_zone = ?, recurrence = ?,
          weekday = ?, local_date = ?, local_start_time = ?, duration_minutes = ?, enabled = ?
        WHERE id = ?
      `)
      .run(
        schedule.channelId,
        schedule.unitId,
        schedule.title,
        schedule.kind,
        schedule.timeZone,
        schedule.recurrence,
        schedule.weekday,
        schedule.localDate,
        schedule.localStartTime,
        schedule.durationMinutes,
        schedule.enabled ? 1 : 0,
        id,
      );
    if (result.changes === 0) return null;
    return this.listBroadcastSchedules().find((value) => value.id === id) || null;
  }

  listScheduleExceptions(): ScheduleException[] {
    return this.db
      .prepare(
        "SELECT schedule_id AS scheduleId, local_date AS localDate, action FROM schedule_exceptions",
      )
      .all()
      .map(scheduleExceptionFromRow);
  }

  cancelScheduleOccurrence(scheduleId: string, localDate: string): ScheduleException {
    this.db
      .prepare(
        "INSERT OR REPLACE INTO schedule_exceptions(schedule_id, local_date, action) VALUES(?, ?, 'cancel')",
      )
      .run(scheduleId, localDate);
    return { scheduleId, localDate, action: "cancel" };
  }

  listManagedPeople(): PersonAccess[] {
    const units = this.db
      .prepare("SELECT email, unit_id AS unitId FROM person_units ORDER BY unit_id")
      .all()
      .map(asRecord);
    return this.db
      .prepare("SELECT email, role, enabled FROM people ORDER BY email")
      .all()
      .map((value) => {
        const row = asRecord(value);
        const email = String(row.email);
        return {
          email,
          role: String(row.role) as PersonAccess["role"],
          enabled: Number(row.enabled) === 1,
          unitIds: units
            .filter((entry) => String(entry.email).toLowerCase() === email.toLowerCase())
            .map((entry) => String(entry.unitId)),
          source: "managed" as const,
        };
      });
  }

  saveManagedPerson(person: Omit<PersonAccess, "source">): PersonAccess {
    const now = new Date().toISOString();
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db
        .prepare(`
          INSERT INTO people(email, role, enabled, created_at, updated_at) VALUES(?, ?, ?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET role=excluded.role, enabled=excluded.enabled,
            updated_at=excluded.updated_at
        `)
        .run(person.email, person.role, person.enabled ? 1 : 0, now, now);
      this.db.prepare("DELETE FROM person_units WHERE email = ?").run(person.email);
      const insert = this.db.prepare("INSERT INTO person_units(email, unit_id) VALUES(?, ?)");
      for (const unitId of person.unitIds) insert.run(person.email, unitId);
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
    return this.listManagedPeople().find((entry) => entry.email === person.email)!;
  }
}

function parseStateDocument(row: unknown): unknown {
  const document = asRecord(row).document;
  if (typeof document !== "string")
    throw new Error("Application state row is missing its document");
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
    createdAt: String(row.createdAt || ""),
  };
}

function unitFromRow(value: unknown): Unit {
  const row = asRecord(value);
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    type: String(row.type) as Unit["type"],
    parentUnitId: row.parentUnitId ? String(row.parentUnitId) : null,
    archivedAt: row.archivedAt ? String(row.archivedAt) : null,
  };
}

function broadcastScheduleFromRow(value: unknown): BroadcastSchedule {
  const row = asRecord(value);
  return {
    id: String(row.id),
    publicId: String(row.publicId),
    channelId: String(row.channelId),
    unitId: String(row.unitId),
    title: String(row.title),
    kind: String(row.kind) as BroadcastSchedule["kind"],
    timeZone: String(row.timeZone),
    recurrence: String(row.recurrence) as BroadcastSchedule["recurrence"],
    weekday: row.weekday === null ? null : Number(row.weekday),
    localDate: row.localDate === null ? null : String(row.localDate),
    localStartTime: String(row.localStartTime),
    durationMinutes: Number(row.durationMinutes),
    enabled: Number(row.enabled) === 1,
  };
}

function scheduleExceptionFromRow(value: unknown): ScheduleException {
  const row = asRecord(value);
  return {
    scheduleId: String(row.scheduleId),
    localDate: String(row.localDate),
    action: "cancel",
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
