export type BroadcastStatus = "offline" | "live" | "replay";
export type SceneMode = "chapel" | "sacrament";
export type SourceType = "ndi" | "network";
export type UnitType = "ward" | "branch" | "stake" | "other";
export type BroadcastKind = "sacrament-meeting" | "stake-conference" | "other";
export type ScheduleRecurrence = "weekly" | "once";
export type AccessRole = "broadcaster" | "administrator";

export interface PersonAccess {
  email: string;
  role: AccessRole;
  unitIds: string[];
  enabled: boolean;
  source: "configuration" | "managed";
}

export interface Unit {
  id: string;
  slug: string;
  name: string;
  type: UnitType;
  parentUnitId: string | null;
  archivedAt: string | null;
}

export interface BroadcastSchedule {
  id: string;
  publicId: string;
  channelId: string;
  unitId: string;
  title: string;
  kind: BroadcastKind;
  timeZone: string;
  recurrence: ScheduleRecurrence;
  weekday: number | null;
  localDate: string | null;
  localStartTime: string;
  durationMinutes: number;
  enabled: boolean;
}

export interface ScheduleException {
  scheduleId: string;
  localDate: string;
  action: "cancel";
}

export interface UpcomingOccurrence {
  key: string;
  scheduleId: string;
  schedulePublicId: string;
  channelId: string;
  unit: Pick<Unit, "id" | "slug" | "name" | "type">;
  title: string;
  kind: BroadcastKind;
  scheduledStart: string;
  scheduledEnd: string;
  localDate: string;
  href: string;
}

export interface Playback {
  webrtcUrl?: string;
  hlsUrl?: string;
  recordingUrl?: string;
  publish?: {
    rtmpUrl: string;
    rtspUrl: string;
    srtUrl: string;
  };
}

export interface VideoSource {
  type: SourceType;
  ndi: {
    sourceName: string;
    urlAddress: string;
    discoveryServer: string;
  };
  capture: {
    videoDevice: string;
    audioDevice: string;
    resolution: string;
    frameRate: number;
  };
  network: {
    uri: string;
    protocol: "rtsp" | "srt";
  };
  notes: string;
}

export interface Broadcast {
  id: string | null;
  channelId: string;
  status: BroadcastStatus;
  mode: SceneMode;
  startedAt: string | null;
  endedAt: string | null;
  expiresAt: string | null;
  playback: Playback | null;
}

export interface PtzPosition {
  pan: number;
  tilt: number;
  zoom: number;
}

export interface PtzPreset {
  id: string;
  name: string;
  group: string;
  protocol: string;
  ndiPreset: number;
  viscaPreset?: number;
  position: PtzPosition | null;
}

export interface Recording {
  id: string;
  channelId: string;
  startedAt: string;
  endedAt: string | null;
  expiresAt: string;
  status: "recording" | "available";
  path: string | null;
}

export interface Actor {
  type?: string;
  id?: string;
  email?: string;
  name?: string;
}

export interface AuditEntry {
  id: string;
  event: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface ApplicationState {
  version: number;
  broadcast: Broadcast;
  source: VideoSource;
  cameraControlSource: VideoSource | null;
  manualSources: VideoSource[];
  viewers: unknown[];
  ptz: {
    presets: PtzPreset[];
    lastRecalledPresetId: string | null;
  };
  recordings: Recording[];
  auditLog: AuditEntry[];
  configuredSources?: VideoSource[];
}

export interface PlaybackSession {
  id?: string;
  viewerId: string;
  viewerName: string;
  broadcastId?: string | null;
  locationId: string;
  transport?: string | null;
  candidateType?: string | null;
  startedAt?: string;
  endedAt?: string | null;
  watchSeconds?: number;
  startupMs?: number | null;
  bufferingMs?: number;
  bufferingCount?: number;
  reconnectCount?: number;
  fallbackReason?: string | null;
  terminalError?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}

export interface ObsCredential {
  id: string;
  unitName: string;
  port: number;
  salt: string;
  secret: string;
  enabled: number | boolean;
  createdAt: string;
}

export type StateMutator<T = ApplicationState> = (state: ApplicationState) => T | Promise<T>;

export interface StateStore {
  load(): Promise<ApplicationState>;
  read(): Promise<ApplicationState>;
  update<T>(mutator: StateMutator<T>): Promise<T>;
  activePlaybackCount?(broadcastId: string | null): number;
}
