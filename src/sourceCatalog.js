export function sourceId(source) {
  if (source?.type === "ndi") return source.ndi?.sourceName ? `ndi:${source.ndi.sourceName}` : "";
  if (source?.type === "network") return source.network?.uri ? `network:${source.network.protocol || "rtsp"}:${source.network.uri}` : "";
  return "";
}

export function buildSourceCatalog({ activeSource, cameraControlSource = null, manualSources = [], discoveredNdiSources = [], discoveryStatus = {}, ingestStatus = null, backendHealth = null } = {}) {
  const sources = new Map();
  const activeSourceId = sourceId(activeSource);
  const cameraControlSourceId = sourceId(cameraControlSource);

  for (const ndi of discoveredNdiSources || []) {
    upsertSource(sources, {
      type: "ndi",
      ndi: { sourceName: ndi.name || "", urlAddress: ndi.urlAddress || "", discoveryServer: "" }
    }, {
      origin: "discovered",
      available: ndi.available !== false,
      discoveryMethod: ndi.source || "ndi"
    });
  }

  for (const source of manualSources || []) {
    upsertSource(sources, source, {
      origin: "manual",
      configured: true,
      available: source.type === "network"
    });
  }

  if (activeSourceId) {
    upsertSource(sources, activeSource, {
      origin: "active",
      activeOnly: true,
      available: false
    });
  }

  if (cameraControlSourceId) {
    upsertSource(sources, cameraControlSource, {
      origin: "camera-control",
      activeOnly: true,
      available: false
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
    sources: [...sources.values()].sort(compareSources),
    discovery: discoveryStatus
  };
}

function upsertSource(sources, source, flags = {}) {
  const id = sourceId(source);
  if (!id) return;
  const existing = sources.get(id);
  const merged = mergeSource(existing?.source, source, { preferPreviousNdiAddress: Boolean(existing?.available && flags.origin !== "discovered") });
  sources.set(id, {
    id,
    type: merged.type,
    name: sourceName(merged),
    detail: sourceDetail(merged),
    source: merged,
    origin: bestOrigin(existing?.origin, flags.origin),
    origins: unique([...(existing?.origins || []), flags.origin].filter(Boolean)),
    configured: Boolean(existing?.configured || flags.configured),
    activeOnly: Boolean(flags.activeOnly && !existing),
    available: Boolean(existing?.available || flags.available),
    discoveryMethod: existing?.discoveryMethod || flags.discoveryMethod || null
  });
}

function mergeSource(previous, next, { preferPreviousNdiAddress = false } = {}) {
  if (!previous) return structuredClone(next);
  return {
    ...previous,
    ...next,
    ndi: {
      ...previous.ndi,
      ...next.ndi,
      urlAddress: preferPreviousNdiAddress
        ? previous.ndi?.urlAddress || next.ndi?.urlAddress || ""
        : next.ndi?.urlAddress || previous.ndi?.urlAddress || ""
    },
    network: {
      ...previous.network,
      ...next.network
    },
    notes: next.notes || previous.notes || ""
  };
}

function sourceName(source) {
  if (source?.type === "ndi") return source.ndi?.sourceName || "Unnamed NDI source";
  if (source?.type === "network") return source.network?.uri || "Unnamed network source";
  return "Unnamed source";
}

function sourceDetail(source) {
  if (source?.type === "ndi") return source.ndi?.urlAddress || "NDI discovery";
  if (source?.type === "network") return source.network?.uri || "";
  return "";
}

function sourceHealth(source, { activeSource, ingestStatus, backendHealth }) {
  if (!source.selected) {
    return {
      ingestReady: null,
      previewReady: null,
      status: source.available ? "available" : "unavailable",
      message: source.available ? "Available" : "Saved source not currently discovered",
      error: null
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
    error: ingestStatus?.lastError?.message || null
  };
}

function selectedMessage({ source, activeSource, ingestStatus, ingestReady, previewReady }) {
  if (ingestStatus?.lastError?.message) return ingestStatus.lastError.message;
  if (!source.available && activeSource?.type === "ndi") return "Selected, but not currently discovered";
  if (ingestReady && previewReady) return "Receiving audio, video, and preview";
  if (ingestReady) return "Receiving input, waiting for preview";
  if (ingestStatus?.status === "starting") return "Starting ingest";
  if (ingestStatus?.status === "running") return "Waiting for audio and video";
  return "Selected";
}

function compareSources(a, b) {
  if (a.selected !== b.selected) return a.selected ? -1 : 1;
  if (a.available !== b.available) return a.available ? -1 : 1;
  if (a.configured !== b.configured) return a.configured ? -1 : 1;
  return a.name.localeCompare(b.name);
}

function bestOrigin(previous, next) {
  if (previous === "discovered" || next === "discovered") return "discovered";
  if (previous === "manual" || next === "manual") return "manual";
  return next || previous || "unknown";
}

function unique(values) {
  return [...new Set(values)];
}
