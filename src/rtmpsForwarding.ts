import type { RtmpsDestination, StateStore } from "./domain.js";

type ForwardingStatus = "disabled" | "idle" | "connecting" | "streaming" | "error";
type HttpRequest = typeof fetch;

export function validateRtmpsDestination(serverUrl: unknown, streamKey: unknown): RtmpsDestination {
  if (typeof serverUrl !== "string" || serverUrl.length > 2048) {
    throw Object.assign(new Error("Enter an RTMPS server URL."), { status: 400 });
  }
  let url: URL;
  try {
    url = new URL(serverUrl.trim());
  } catch {
    throw Object.assign(new Error("Enter a valid RTMPS server URL."), { status: 400 });
  }
  if (
    url.protocol !== "rtmps:" ||
    !url.hostname ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw Object.assign(
      new Error("Use an rtmps:// server URL without credentials or query parameters."),
      {
        status: 400,
      },
    );
  }
  if (
    typeof streamKey !== "string" ||
    !streamKey.trim() ||
    streamKey.length > 512 ||
    /[\s/?#\\]/.test(streamKey)
  ) {
    throw Object.assign(new Error("Enter the stream key separately from the server URL."), {
      status: 400,
    });
  }
  return { serverUrl: url.href.replace(/\/$/, ""), streamKey: streamKey.trim() };
}

/** Forwards live streams using MediaMTX's hot-reloadable native forwarding API. */
export class RtmpsForwarding {
  private readonly store: StateStore;
  private readonly apiBaseUrl: string;
  private readonly channelId: string;
  private readonly request: HttpRequest;
  private appliedDestination: string | null = null;
  private dirty = false;
  private live = false;
  private state: ForwardingStatus = "disabled";
  private lastError: string | null = null;
  private retryTimer: NodeJS.Timeout | null = null;
  private queue: Promise<void> = Promise.resolve();

  constructor({
    store,
    apiBaseUrl,
    channelId,
    request = fetch,
  }: {
    store: StateStore;
    apiBaseUrl: string;
    channelId: string;
    request?: HttpRequest;
  }) {
    this.store = store;
    this.apiBaseUrl = apiBaseUrl.replace(/\/$/, "");
    this.channelId = channelId;
    this.request = request;
  }

  /** Keep stream keys and MediaMTX's potentially sensitive raw errors private. */
  async summary() {
    const { rtmpsDestination: destination } = await this.store.read();
    let status = this.state;
    let lastError = this.lastError;
    if (destination && this.live && this.appliedDestination && status !== "error") {
      try {
        const response = await this.request(
          `${this.apiBaseUrl}/v3/paths/forward-dests/list?path=${encodeURIComponent(this.channelId)}`,
          { signal: AbortSignal.timeout(2500) },
        );
        if (response.status === 404) {
          status = "connecting"; // The source path is not publishing yet.
        } else if (!response.ok) {
          status = "error";
          lastError = "Could not retrieve MediaMTX forwarding status.";
        } else {
          const body: unknown = await response.json();
          const items =
            body && typeof body === "object" && "items" in body && Array.isArray(body.items)
              ? body.items
              : [];
          const entry = items.find(
            (item: unknown) =>
              item && typeof item === "object" && "pos" in item && item.pos === 0,
          );
          const runtimeState =
            entry && typeof entry === "object" && "state" in entry ? entry.state : null;
          status =
            runtimeState === "forwarding"
              ? "streaming"
              : runtimeState === "error"
                ? "error"
                : "connecting";
          lastError =
            runtimeState === "error"
              ? "MediaMTX could not forward the stream. Check the RTMPS destination and network."
              : null;
        }
      } catch {
        status = "error";
        lastError = "Could not retrieve MediaMTX forwarding status.";
      }
    }
    return {
      enabled: Boolean(destination),
      serverUrl: destination?.serverUrl || "",
      hasStreamKey: Boolean(destination?.streamKey),
      status,
      lastError,
    };
  }

  async configure(input: Record<string, unknown>) {
    await this.store.update((state) => {
      if (input.enabled === false) {
        state.rtmpsDestination = null;
        return;
      }
      const oldKey = state.rtmpsDestination?.streamKey || "";
      const key =
        input.streamKey === "" || input.streamKey === undefined ? oldKey : input.streamKey;
      state.rtmpsDestination = validateRtmpsDestination(input.serverUrl, key);
    });
    await this.sync(this.live);
    return this.summary();
  }

  /** Serialize broadcaster changes and broadcast start/stop transitions. */
  sync(live: boolean): Promise<void> {
    this.live = live;
    this.queue = this.queue.catch(() => {}).then(() => this.reconcile());
    return this.queue;
  }

  /** A managed MediaMTX restart regenerates its YAML without forwarding settings. */
  mediaRestart(live: boolean): Promise<void> {
    this.live = live;
    this.queue = this.queue
      .catch(() => {})
      .then(() => {
        this.appliedDestination = null;
        this.dirty = true;
        return this.reconcile();
      });
    return this.queue;
  }

  private async reconcile() {
    const { rtmpsDestination: destination } = await this.store.read();
    const target =
      this.live && destination
        ? destination.serverUrl + "#" + encodeURIComponent(destination.streamKey)
        : null;
    if (target === this.appliedDestination && !this.dirty) {
      if (!target) {
        this.state = destination ? "idle" : "disabled";
        this.lastError = null;
      }
      return;
    }
    try {
      const response = await this.request(
        `${this.apiBaseUrl}/v3/config/paths/patch/${encodeURIComponent(this.channelId)}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ forward: target ? [{ dest: target }] : [] }),
          signal: AbortSignal.timeout(3000),
        },
      );
      if (!response.ok) throw new Error("MediaMTX refused forwarding configuration");
      this.appliedDestination = target;
      this.dirty = false;
      this.state = target ? "connecting" : destination ? "idle" : "disabled";
      this.lastError = null;
      this.clearRetry();
    } catch {
      // A failed request may have been applied before its response was lost.
      this.dirty = true;
      this.state = "error";
      this.lastError = "Could not update MediaMTX forwarding; retrying.";
      this.scheduleRetry();
    }
  }

  private clearRetry() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.retryTimer = null;
  }

  private scheduleRetry() {
    if (this.retryTimer) return;
    // Retry removal as well: a failed stop must not leave the external stream active.
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      void this.sync(this.live);
    }, 3000);
    this.retryTimer.unref();
  }

  async stop() {
    await this.sync(false);
    this.clearRetry();
  }
}
