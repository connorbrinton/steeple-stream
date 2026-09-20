import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJson } from "../shared/api.ts";
import { formatDateTime } from "./App.tsx";
import type { UpcomingOccurrence } from "./App.tsx";

export function OccurrencePage() {
  const { publicId = "", localDate = "" } = useParams();
  const [occurrence, setOccurrence] = useState<UpcomingOccurrence | null>(null);
  const [missing, setMissing] = useState(false);

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
            <div className="broadcast-badge">Upcoming</div>
            <p className="public-eyebrow">{occurrence.unit.name}</p>
            <h1>{occurrence.title}</h1>
            <p className="occurrence-time">
              <time dateTime={occurrence.scheduledStart}>
                {formatDateTime(occurrence.scheduledStart)}
              </time>
            </p>
            <p>
              This broadcast has not started yet. This page will become available for viewing when
              the meeting begins.
            </p>
            <a className="button" href="/">
              Back to broadcasts
            </a>
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
