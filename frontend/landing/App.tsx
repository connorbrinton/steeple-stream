import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getJson } from "../shared/api.ts";

type BroadcastStatus = "offline" | "live" | "replay";

interface PublicBroadcast {
  id: string | null;
  channelId: string;
  status: BroadcastStatus;
  mode: "chapel" | "sacrament";
  startedAt: string | null;
  endedAt: string | null;
  expiresAt: string | null;
  association: {
    unitId: string;
    unitName: string;
    title: string;
    occurrenceKey: string | null;
  } | null;
}

interface PublicState {
  broadcast: PublicBroadcast;
  viewerCount: number;
  upcoming: UpcomingOccurrence[];
}

export interface UpcomingOccurrence {
  key: string;
  schedulePublicId: string;
  channelId: string;
  unit: {
    id: string;
    slug: string;
    name: string;
    type: "ward" | "branch" | "stake" | "other";
  };
  title: string;
  kind: "sacrament-meeting" | "stake-conference" | "other";
  scheduledStart: string;
  scheduledEnd: string;
  localDate: string;
  href: string;
}

interface PublicStateResult {
  state: PublicState | null;
  unavailable: boolean;
}

const refreshIntervalMs = 5_000;

export function App() {
  const [{ state, unavailable }, setResult] = useState<PublicStateResult>({
    state: null,
    unavailable: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const nextState = await getJson<PublicState>("/api/public-state", controller.signal);
        setResult({ state: nextState, unavailable: false });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(error);
        setResult((current) => ({ ...current, unavailable: true }));
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), refreshIntervalMs);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="public-shell">
      <header className="public-header">
        <a className="public-brand" href="/">
          Steeple Stream
        </a>
        <a className="button compact" href="/broadcaster">
          Broadcaster sign in
        </a>
      </header>
      <main className="public-main">
        <div className="public-intro">
          <p className="public-eyebrow">Church broadcasts</p>
          <h1>Watch a meeting</h1>
          <p>Join a live broadcast or return to a recently completed meeting.</p>
        </div>
        {unavailable && (
          <div className="public-notice" role="status">
            Broadcast information is temporarily unavailable. Retrying automatically.
          </div>
        )}
        {!state ? (
          <BroadcastSection title="Broadcasts">
            <p className="meta">Checking for broadcasts.</p>
          </BroadcastSection>
        ) : (
          <>
            <CurrentBroadcast state={state} />
            <UpcomingBroadcasts occurrences={state.upcoming} />
          </>
        )}
      </main>
    </div>
  );
}

function CurrentBroadcast({ state }: { state: PublicState }) {
  const { broadcast } = state;
  if (broadcast.status === "offline") {
    return (
      <BroadcastSection title="Broadcasts">
        <div className="broadcast-empty">
          <h2>No broadcast is currently active</h2>
          <p>Upcoming broadcasts will appear here once scheduling is configured.</p>
        </div>
      </BroadcastSection>
    );
  }

  const live = broadcast.status === "live";
  return (
    <BroadcastSection title={live ? "Live now" : "Recent broadcast"}>
      <article className="broadcast-card">
        <div>
          <div className={`broadcast-badge ${live ? "live" : "replay"}`}>
            {live ? "Live" : "Replay"}
          </div>
          <h2>{broadcast.association?.title || "Meeting broadcast"}</h2>
          <p>
            {broadcast.association?.unitName && <>{broadcast.association.unitName} · </>}
            {broadcastSummary(broadcast, state.viewerCount)}
          </p>
        </div>
        <a
          className="button primary"
          href={`/broadcasts/${encodeURIComponent(broadcast.channelId)}`}
        >
          {live ? "Watch live" : "Watch replay"}
        </a>
      </article>
    </BroadcastSection>
  );
}

function BroadcastSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="broadcast-section">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}

function UpcomingBroadcasts({ occurrences }: { occurrences: UpcomingOccurrence[] }) {
  if (occurrences.length === 0) return null;
  return (
    <BroadcastSection title="Upcoming">
      <div className="broadcast-list">
        {occurrences.map((occurrence) => (
          <a
            className="broadcast-card broadcast-card-link"
            href={occurrence.href}
            key={occurrence.key}
          >
            <div>
              <div className="broadcast-badge">Upcoming</div>
              <h2>{occurrence.title}</h2>
              <p>{occurrence.unit.name}</p>
            </div>
            <time dateTime={occurrence.scheduledStart}>
              {formatDateTime(occurrence.scheduledStart)}
            </time>
          </a>
        ))}
      </div>
    </BroadcastSection>
  );
}

function broadcastSummary(broadcast: PublicBroadcast, viewerCount: number) {
  const started = broadcast.startedAt ? formatDateTime(broadcast.startedAt) : null;
  if (broadcast.status === "live") {
    const viewers = `${viewerCount} ${viewerCount === 1 ? "viewer" : "viewers"}`;
    return started ? `Started ${started} · ${viewers}` : viewers;
  }
  return started ? `Recorded ${started}` : "Replay available";
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
