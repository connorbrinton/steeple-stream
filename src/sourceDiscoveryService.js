import { EventEmitter } from "node:events";
import { discoverNdiSources } from "./sourceDiscovery.js";
export class SourceDiscoveryService extends EventEmitter {
    constructor({ discover = discoverNdiSources, intervalMs = 7000, logger = console } = {}) {
        super();
        this.discover = discover;
        this.intervalMs = intervalMs;
        this.logger = logger;
        this.sources = new Map();
        this.timer = null;
        this.refreshPromise = null;
        this.lastStartedAt = null;
        this.lastCompletedAt = null;
        this.lastError = null;
    }
    async start({ waitForInitial = true } = {}) {
        if (!this.timer && this.intervalMs > 0) {
            this.timer = setInterval(() => this.triggerRefresh(), this.intervalMs);
            this.timer.unref();
        }
        const refresh = this.refresh().catch((error) => {
            this.logger.warn?.("Initial NDI discovery failed", error);
            return this.listNdiSources();
        });
        if (waitForInitial)
            await refresh;
    }
    stop() {
        if (this.timer)
            clearInterval(this.timer);
        this.timer = null;
    }
    triggerRefresh() {
        this.refresh().catch((error) => {
            this.logger.warn?.("NDI discovery refresh failed", error);
        });
    }
    async refresh() {
        if (this.refreshPromise)
            return this.refreshPromise;
        this.lastStartedAt = new Date().toISOString();
        this.refreshPromise = this.discover()
            .then((sources) => {
            this.replaceSources(sources);
            this.lastCompletedAt = new Date().toISOString();
            this.lastError = null;
            return this.listNdiSources();
        })
            .catch((error) => {
            this.lastCompletedAt = new Date().toISOString();
            this.lastError = {
                message: error.message,
                at: this.lastCompletedAt
            };
            throw error;
        })
            .finally(() => {
            this.refreshPromise = null;
        });
        return this.refreshPromise;
    }
    listNdiSources(currentSource = null) {
        const sources = [...this.sources.values()];
        const configured = currentSource?.ndi?.sourceName;
        if (configured && !sources.some((source) => source.name === configured)) {
            sources.push({
                name: configured,
                urlAddress: currentSource.ndi?.urlAddress || "",
                source: "configured",
                available: false
            });
        }
        return sources.sort((a, b) => a.name.localeCompare(b.name));
    }
    resolveNdiSource(source) {
        if (source?.type !== "ndi" || !source.ndi?.sourceName)
            return source;
        const match = this.sources.get(source.ndi.sourceName);
        if (!match || match.available === false || !match.urlAddress || match.urlAddress === source.ndi.urlAddress) {
            return source;
        }
        return {
            ...source,
            ndi: {
                ...source.ndi,
                urlAddress: match.urlAddress
            }
        };
    }
    status() {
        return {
            ndi: {
                sourceCount: this.sources.size,
                refreshing: Boolean(this.refreshPromise),
                intervalMs: this.intervalMs,
                lastStartedAt: this.lastStartedAt,
                lastCompletedAt: this.lastCompletedAt,
                lastError: this.lastError
            }
        };
    }
    replaceSources(sources) {
        const next = new Map();
        for (const source of sources || []) {
            if (!source?.name)
                continue;
            next.set(source.name, {
                ...source,
                available: source.available !== false
            });
        }
        const changed = sourceSnapshot(this.sources) !== sourceSnapshot(next);
        this.sources = next;
        if (changed)
            this.emit("changed", this.listNdiSources());
    }
}
function sourceSnapshot(sources) {
    return JSON.stringify([...sources.values()].sort((a, b) => a.name.localeCompare(b.name)));
}
