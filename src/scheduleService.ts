import { Temporal } from "@js-temporal/polyfill";
import type { BroadcastSchedule, ScheduleException, Unit, UpcomingOccurrence } from "./domain.js";

interface ScheduleStore {
  listUnits(): Unit[];
  listBroadcastSchedules(): BroadcastSchedule[];
  listScheduleExceptions(): ScheduleException[];
}

export class ScheduleService {
  constructor(private readonly store: ScheduleStore) {}

  upcoming({ from = new Date(), days = 14, channelId }: UpcomingOptions = {}) {
    const fromInstant = Temporal.Instant.from(from.toISOString());
    const untilInstant = fromInstant.add({ hours: days * 24 });
    const units = new Map(this.store.listUnits().map((unit) => [unit.id, unit]));
    const cancellations = new Set(
      this.store
        .listScheduleExceptions()
        .filter((entry) => entry.action === "cancel")
        .map((entry) => `${entry.scheduleId}/${entry.localDate}`),
    );
    const occurrences: UpcomingOccurrence[] = [];

    for (const schedule of this.store.listBroadcastSchedules()) {
      if (!schedule.enabled || (channelId && schedule.channelId !== channelId)) continue;
      const unit = units.get(schedule.unitId);
      if (!unit || unit.archivedAt) continue;
      const firstDate = fromInstant.toZonedDateTimeISO(schedule.timeZone).toPlainDate();
      for (let offset = 0; offset <= days + 1; offset += 1) {
        const localDate = firstDate.add({ days: offset });
        if (!matches(schedule, localDate)) continue;
        const date = localDate.toString();
        if (cancellations.has(`${schedule.id}/${date}`)) continue;
        const occurrence = occurrenceFor(schedule, unit, date);
        const start = Temporal.Instant.from(occurrence.scheduledStart);
        if (Temporal.Instant.compare(start, fromInstant) < 0) continue;
        if (Temporal.Instant.compare(start, untilInstant) >= 0) continue;
        occurrences.push(occurrence);
      }
    }
    return occurrences.toSorted((left, right) =>
      left.scheduledStart.localeCompare(right.scheduledStart),
    );
  }

  occurrence(publicId: string, localDate: string): UpcomingOccurrence | null {
    const schedule = this.store
      .listBroadcastSchedules()
      .find((entry) => entry.publicId === publicId && entry.enabled);
    if (!schedule) return null;
    const unit = this.store.listUnits().find((entry) => entry.id === schedule.unitId);
    if (!unit || unit.archivedAt) return null;
    let date: Temporal.PlainDate;
    try {
      date = Temporal.PlainDate.from(localDate);
    } catch {
      return null;
    }
    if (!matches(schedule, date)) return null;
    const cancelled = this.store
      .listScheduleExceptions()
      .some(
        (entry) =>
          entry.scheduleId === schedule.id &&
          entry.localDate === localDate &&
          entry.action === "cancel",
      );
    return cancelled ? null : occurrenceFor(schedule, unit, localDate);
  }
}

interface UpcomingOptions {
  from?: Date;
  days?: number;
  channelId?: string;
}

function matches(schedule: BroadcastSchedule, date: Temporal.PlainDate) {
  if (schedule.recurrence === "once") return schedule.localDate === date.toString();
  return schedule.weekday === date.dayOfWeek % 7;
}

function occurrenceFor(schedule: BroadcastSchedule, unit: Unit, localDate: string) {
  const localStart = Temporal.PlainDateTime.from(`${localDate}T${schedule.localStartTime}`);
  const start = localStart.toZonedDateTime(schedule.timeZone).toInstant();
  const end = start.add({ seconds: schedule.durationMinutes * 60 });
  const key = `${schedule.publicId}/${localDate}`;
  return {
    key,
    scheduleId: schedule.id,
    schedulePublicId: schedule.publicId,
    channelId: schedule.channelId,
    unit: { id: unit.id, slug: unit.slug, name: unit.name, type: unit.type },
    title: schedule.title,
    kind: schedule.kind,
    scheduledStart: start.toString(),
    scheduledEnd: end.toString(),
    localDate,
    href: `/broadcasts/${encodeURIComponent(schedule.publicId)}/${localDate}`,
  } satisfies UpcomingOccurrence;
}
