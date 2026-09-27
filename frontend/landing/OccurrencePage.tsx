import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJson } from "../shared/api.ts";
import { formatDateTime } from "./App.tsx";
import type { UpcomingOccurrence } from "./App.tsx";

export function OccurrencePage() {
  const { publicId = "", localDate = "" } = useParams();
  const [occurrence, setOccurrence] = useState<UpcomingOccurrence | null>(null);
  const [missing, setMissing] = useState(false);
  const [active, setActive] = useState<"live" | "replay" | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getJson<UpcomingOccurrence>(
      `/api/public-occurrences/${encodeURIComponent(publicId)}/${encodeURIComponent(localDate)}`,
      controller.signal,
    )
      .then(setOccurrence)
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error(error);
        setMissing(true);
      });
    return () => controller.abort();
  }, [publicId, localDate]);

  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const state = await getJson<{
          broadcast: {
            status: "offline" | "live" | "replay";
            association: { occurrenceKey: string | null } | null;
          };
        }>("/api/public-state", controller.signal);
        const key = `${publicId}/${localDate}`;
        setActive(
          state.broadcast.association?.occurrenceKey === key && state.broadcast.status !== "offline"
            ? state.broadcast.status
            : null,
        );
      } catch (error) {
        if (!controller.signal.aborted) console.error(error);
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 5_000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [publicId, localDate]);

  return (
    <div className="public-shell">
      <header className="public-header">
        <a className="public-brand" href="/">
          Steeple Stream
        </a>
      </header>
      <main className="public-main occurrence-main">
        {occurrence ? (
          <article className="occurrence-card">
            <div className={`broadcast-badge ${active || ""}`}>
              {active === "live" ? "Live" : active === "replay" ? "Replay" : "Upcoming"}
            </div>
            <p className="public-eyebrow">{occurrence.unit.name}</p>
            <h1>{occurrence.title}</h1>
            <p className="occurrence-time">
              <time dateTime={occurrence.scheduledStart}>
                {formatDateTime(occurrence.scheduledStart)}
              </time>
            </p>
            {active ? (
              <a className="button primary" href={`/broadcasts/${occurrence.channelId}`}>
                {active === "live" ? "Watch live" : "Watch replay"}
              </a>
            ) : (
              <>
                <p>
                  This broadcast has not started yet. This page will become available for viewing
                  when the meeting begins.
                </p>
                <a className="button" href="/">
                  Back to broadcasts
                </a>
              </>
            )}
          </article>
        ) : missing ? (
          <div className="broadcast-empty">
            <h1>Broadcast not found</h1>
            <p>This scheduled broadcast may have been cancelled or moved.</p>
            <a className="button" href="/">
              View broadcasts
            </a>
          </div>
        ) : (
          <p className="meta">Loading broadcast.</p>
        )}
      </main>
    </div>
  );
}
