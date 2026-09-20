import type { VideoSource } from "./domain.js";

interface DiscoveredNdiSource {
  name?: string;
  urlAddress?: string;
  available?: boolean;
  source?: string;
}

interface IngestStatus {
  ready?: boolean;
  status?: string;
  inputs?: { video?: { ready?: boolean }; audio?: { ready?: boolean } };
  lastError?: { message?: string } | null;
}

interface BackendHealth {
  ok?: boolean;
  backend?: string;
  ready?: boolean;
  message?: string;
}

interface CatalogSource {
  id: string;
  type: VideoSource["type"];
  name: string;
  detail: string;
  source: VideoSource;
  origin: string;
  origins: string[];
  configured: boolean;
  activeOnly: boolean;
  available: boolean;
  discoveryMethod: string | null;
  selected?: boolean;
  cameraControl?: boolean;
  health?: ReturnType<typeof sourceHealth>;
}

interface CatalogOptions {
  activeSource: VideoSource;
  cameraControlSource?: VideoSource | null;
  manualSources?: VideoSource[];
  discoveredNdiSources?: DiscoveredNdiSource[];
  discoveryStatus?: Record<string, unknown>;
  ingestStatus?: IngestStatus | null;
  backendHealth?: BackendHealth | null;
}

interface SourceFlags {
  origin?: string;
  configured?: boolean;
  activeOnly?: boolean;
  available?: boolean;
  discoveryMethod?: string;
}

export function sourceId(source?: Partial<VideoSource> | null): string {
  if (source?.type === "ndi") return source.ndi?.sourceName ? `ndi:${source.ndi.sourceName}` : "";
  if (source?.type === "network")
    return source.network?.uri
      ? `network:${source.network.protocol || "rtsp"}:${source.network.uri}`
      : "";
  return "";
}

export function buildSourceCatalog({
  activeSource,
  cameraControlSource = null,
  manualSources = [],
  discoveredNdiSources = [],
  discoveryStatus = {},
  ingestStatus = null,
  backendHealth = null,
}: CatalogOptions) {
  const sources = new Map<string, CatalogSource>();
  const activeSourceId = sourceId(activeSource);
  const cameraControlSourceId = sourceId(cameraControlSource);

  for (const ndi of discoveredNdiSources || []) {
    upsertSource(
      sources,
      {
        type: "ndi",
        ndi: { sourceName: ndi.name || "", urlAddress: ndi.urlAddress || "", discoveryServer: "" },
        capture: { videoDevice: "", audioDevice: "", resolution: "1920x1080", frameRate: 30 },
        network: { uri: "", protocol: "rtsp" },
        notes: "",
      },
      {
        origin: "discovered",
        available: ndi.available !== false,
        discoveryMethod: ndi.source || "ndi",
      },
    );
  }

  for (const source of manualSources || []) {
    upsertSource(sources, source, {
      origin: "manual",
      configured: true,
      available: source.type === "network",
    });
  }

  if (activeSourceId) {
    upsertSource(sources, activeSource, {
      origin: "active",
      activeOnly: true,
      available: false,
    });
  }

  if (cameraControlSourceId && cameraControlSource) {
    upsertSource(sources, cameraControlSource, {
      origin: "camera-control",
      activeOnly: true,
      available: false,
    });
  }

  for (const source of sources.values()) {
    source.selected = source.id === activeSourceId;
    source.cameraControl = source.id === cameraControlSourceId;
    source.health = sourceHealth(source, { activeSource, ingestStatus, backendHealth });
  }

  return {
    activeSourceId: activeSourceId || null,
    cameraControlSourceId: cameraControlSourceId || null,
    sources: [...sources.values()].toSorted(compareSources),
    discovery: discoveryStatus,
  };
}

function upsertSource(
  sources: Map<string, CatalogSource>,
  source: VideoSource,
  flags: SourceFlags = {},
) {
  const id = sourceId(source);
  if (!id) return;
  const existing = sources.get(id);
  const merged = mergeSource(existing?.source, source, {
    preferPreviousNdiAddress: Boolean(existing?.available && flags.origin !== "discovered"),
  });
  sources.set(id, {
    id,
    type: merged.type,
    name: sourceName(merged),
    detail: sourceDetail(merged),
    source: merged,
    origin: bestOrigin(existing?.origin, flags.origin),
    origins: unique(
      [...(existing?.origins || []), flags.origin].filter((origin): origin is string =>
        Boolean(origin),
      ),
    ),
    configured: Boolean(existing?.configured || flags.configured),
    activeOnly: Boolean(flags.activeOnly && !existing),
    available: Boolean(existing?.available || flags.available),
    discoveryMethod: existing?.discoveryMethod || flags.discoveryMethod || null,
  });
}

function mergeSource(
  previous: VideoSource | undefined,
  next: VideoSource,
  { preferPreviousNdiAddress = false }: { preferPreviousNdiAddress?: boolean } = {},
): VideoSource {
  if (!previous) return structuredClone(next);
  return {
    ...previous,
    ...next,
    ndi: {
      ...previous.ndi,
      ...next.ndi,
      urlAddress: preferPreviousNdiAddress
        ? previous.ndi?.urlAddress || next.ndi?.urlAddress || ""
        : next.ndi?.urlAddress || previous.ndi?.urlAddress || "",
    },
    network: {
      ...previous.network,
      ...next.network,
    },
    notes: next.notes || previous.notes || "",
  };
}

function sourceName(source: VideoSource): string {
  if (source?.type === "ndi") return source.ndi?.sourceName || "Unnamed NDI source";
  if (source?.type === "network") return source.network?.uri || "Unnamed network source";
  return "Unnamed source";
}

function sourceDetail(source: VideoSource): string {
  if (source?.type === "ndi") return source.ndi?.urlAddress || "NDI discovery";
  if (source?.type === "network") return source.network?.uri || "";
  return "";
}

function sourceHealth(
  source: CatalogSource,
  {
    activeSource,
    ingestStatus,
    backendHealth,
  }: Pick<CatalogOptions, "activeSource" | "ingestStatus" | "backendHealth">,
) {
  if (!source.selected) {
    return {
      ingestReady: null,
      previewReady: null,
      status: source.available ? "available" : "unavailable",
      message: source.available ? "Available" : "Saved source not currently discovered",
      error: null,
    };
  }
  const inputVideoReady = Boolean(ingestStatus?.inputs?.video?.ready);
  const inputAudioReady = Boolean(ingestStatus?.inputs?.audio?.ready);
  const ingestReady = Boolean(ingestStatus?.ready && inputVideoReady && inputAudioReady);
  const previewReady = Boolean(backendHealth?.ready);
  return {
    ingestReady,
    previewReady,
    status: ingestReady && previewReady ? "healthy" : ingestStatus?.status || "selected",
    message: selectedMessage({ source, activeSource, ingestStatus, ingestReady, previewReady }),
    error: ingestStatus?.lastError?.message || null,
  };
}

function selectedMessage({
  source,
  activeSource,
  ingestStatus,
  ingestReady,
  previewReady,
}: {
  source: CatalogSource;
  activeSource: VideoSource;
  ingestStatus?: IngestStatus | null;
  ingestReady: boolean;
  previewReady: boolean;
}): string {
  if (ingestStatus?.lastError?.message) return ingestStatus.lastError.message;
  if (!source.available && activeSource?.type === "ndi")
    return "Selected, but not currently discovered";
  if (ingestReady && previewReady) return "Receiving audio, video, and preview";
  if (ingestReady) return "Receiving input, waiting for preview";
  if (ingestStatus?.status === "starting") return "Starting ingest";
  if (ingestStatus?.status === "running") return "Waiting for audio and video";
  return "Selected";
}

function compareSources(a: CatalogSource, b: CatalogSource): number {
  if (a.selected !== b.selected) return a.selected ? -1 : 1;
  if (a.available !== b.available) return a.available ? -1 : 1;
  if (a.configured !== b.configured) return a.configured ? -1 : 1;
  return a.name.localeCompare(b.name);
}

function bestOrigin(previous?: string, next?: string): string {
  if (previous === "discovered" || next === "discovered") return "discovered";
  if (previous === "manual" || next === "manual") return "manual";
  return next || previous || "unknown";
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
