import type {
  BroadcastKind,
  BroadcastSchedule,
  ScheduleRecurrence,
  Unit,
  UnitType,
} from "./domain.js";

interface CatalogStore {
  listUnits(): Unit[];
  createUnit(unit: Omit<Unit, "id" | "archivedAt">): Unit;
  updateUnit(id: string, unit: Omit<Unit, "id" | "archivedAt">): Unit | null;
  listBroadcastSchedules(): BroadcastSchedule[];
  createBroadcastSchedule(schedule: Omit<BroadcastSchedule, "id" | "publicId">): BroadcastSchedule;
  updateBroadcastSchedule(
    id: string,
    schedule: Omit<BroadcastSchedule, "id" | "publicId">,
  ): BroadcastSchedule | null;
}

type Input = Record<string, unknown>;

export class AdminCatalogService {
  constructor(
    private readonly store: CatalogStore,
    private readonly channelId: string,
  ) {}

  list() {
    return {
      channelId: this.channelId,
      units: this.store.listUnits(),
      schedules: this.store.listBroadcastSchedules(),
    };
  }

  saveUnit(input: Input, id?: string): Unit {
    const slug = requiredString(input.slug, "Unit URL slug", 64).toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      invalid("Unit URL slug may contain lowercase letters, numbers, and single hyphens");
    const name = requiredString(input.name, "Unit name", 80);
    const type = allowed(input.type, ["ward", "branch", "stake", "other"] as const, "Unit type");
    const parentUnitId = optionalString(input.parentUnitId);
    const units = this.store.listUnits();
    if (units.some((unit) => unit.slug === slug && unit.id !== id))
      invalid("That unit URL slug is already in use", 409);
    if (parentUnitId && !units.some((unit) => unit.id === parentUnitId && !unit.archivedAt))
      invalid("Parent unit was not found");
    if (parentUnitId === id) invalid("A unit cannot be its own parent");
    const value = { slug, name, type: type as UnitType, parentUnitId };
    if (!id) return this.store.createUnit(value);
    return this.store.updateUnit(id, value) || invalid("Unit was not found", 404);
  }

  saveSchedule(input: Input, id?: string): BroadcastSchedule {
    const unitId = requiredString(input.unitId, "Unit", 100);
    if (!this.store.listUnits().some((unit) => unit.id === unitId && !unit.archivedAt))
      invalid("Unit was not found");
    const title = requiredString(input.title, "Title", 120);
    const kind = allowed(
      input.kind,
      ["sacrament-meeting", "stake-conference", "other"] as const,
      "Broadcast kind",
    ) as BroadcastKind;
    const timeZone = requiredString(input.timeZone, "Time zone", 80);
    try {
      new Intl.DateTimeFormat("en-US", { timeZone }).format();
    } catch {
      invalid("Time zone must be a valid IANA time zone");
    }
    const recurrence = allowed(
      input.recurrence,
      ["weekly", "once"] as const,
      "Recurrence",
    ) as ScheduleRecurrence;
    const localStartTime = requiredString(input.localStartTime, "Start time", 5);
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(localStartTime))
      invalid("Start time must use 24-hour HH:MM format");
    const durationMinutes = Number(input.durationMinutes);
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 720)
      invalid("Duration must be between 1 and 720 minutes");
    let weekday: number | null = null;
    if (recurrence === "weekly") {
      const value = Number(input.weekday);
      if (!Number.isInteger(value) || value < 0 || value > 6)
        invalid("Weekday is required for a weekly schedule");
      weekday = value;
    }
    const localDate = recurrence === "once" ? requiredString(input.localDate, "Date", 10) : null;
    if (localDate && !/^\d{4}-\d{2}-\d{2}$/.test(localDate))
      invalid("Date must use YYYY-MM-DD format");
    const enabled = input.enabled !== false;
    const value = {
      channelId: this.channelId,
      unitId,
      title,
      kind,
      timeZone,
      recurrence,
      weekday,
      localDate,
      localStartTime,
      durationMinutes,
      enabled,
    };
    if (!id) return this.store.createBroadcastSchedule(value);
    return this.store.updateBroadcastSchedule(id, value) || invalid("Schedule was not found", 404);
  }
}

function requiredString(value: unknown, label: string, maxLength: number): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) invalid(`${label} is required`);
  if (text.length > maxLength) invalid(`${label} must be ${maxLength} characters or fewer`);
  return text;
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function allowed<const T extends readonly string[]>(
  value: unknown,
  values: T,
  label: string,
): T[number] {
  if (typeof value !== "string" || !values.includes(value)) invalid(`${label} is invalid`);
  return value as T[number];
}

function invalid(message: string, status = 400): never {
  throw Object.assign(new Error(message), { status });
}
