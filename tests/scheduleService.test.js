import assert from "node:assert/strict";
import test from "node:test";
import { ScheduleService } from "../src/scheduleService.js";

const unit = {
  id: "unit-1",
  slug: "harris-lake",
  name: "Harris Lake Ward",
  type: "ward",
  parentUnitId: null,
  archivedAt: null,
};

function store(schedules, exceptions = []) {
  return {
    listUnits: () => [unit],
    listBroadcastSchedules: () => schedules,
    listScheduleExceptions: () => exceptions,
  };
}

test("weekly schedules expand at a stable local time across daylight saving", () => {
  const schedule = {
    id: "schedule-1",
    publicId: "harris-lake-sacrament",
    channelId: "stakecenter",
    unitId: unit.id,
    title: "Sacrament Meeting",
    kind: "sacrament-meeting",
    timeZone: "America/New_York",
    recurrence: "weekly",
    weekday: 0,
    localDate: null,
    localStartTime: "11:00",
    durationMinutes: 90,
    enabled: true,
  };
  const service = new ScheduleService(store([schedule]));
  const occurrences = service.upcoming({
    from: new Date("2026-03-01T00:00:00Z"),
    days: 15,
    channelId: "stakecenter",
  });

  assert.deepEqual(
    occurrences.map((entry) => [entry.localDate, entry.scheduledStart, entry.key]),
    [
      ["2026-03-01", "2026-03-01T16:00:00Z", "harris-lake-sacrament/2026-03-01"],
      ["2026-03-08", "2026-03-08T15:00:00Z", "harris-lake-sacrament/2026-03-08"],
      ["2026-03-15", "2026-03-15T15:00:00Z", "harris-lake-sacrament/2026-03-15"],
    ],
  );
});

test("one-time schedules and cancellations resolve through stable occurrence URLs", () => {
  const recurring = {
    id: "weekly",
    publicId: "weekly-public",
    channelId: "stakecenter",
    unitId: unit.id,
    title: "Sacrament Meeting",
    kind: "sacrament-meeting",
    timeZone: "America/New_York",
    recurrence: "weekly",
    weekday: 0,
    localDate: null,
    localStartTime: "11:00",
    durationMinutes: 90,
    enabled: true,
  };
  const conference = {
    ...recurring,
    id: "conference",
    publicId: "conference-public",
    title: "Stake Conference — Sunday General Session",
    kind: "stake-conference",
    recurrence: "once",
    weekday: null,
    localDate: "2026-10-18",
    localStartTime: "10:00",
  };
  const service = new ScheduleService(
    store(
      [recurring, conference],
      [{ scheduleId: recurring.id, localDate: "2026-10-18", action: "cancel" }],
    ),
  );

  const occurrences = service.upcoming({
    from: new Date("2026-10-18T00:00:00Z"),
    days: 1,
  });
  assert.equal(occurrences.length, 1);
  assert.equal(occurrences[0].key, "conference-public/2026-10-18");
  assert.equal(occurrences[0].href, "/broadcasts/conference-public/2026-10-18");
  assert.equal(service.occurrence("weekly-public", "2026-10-18"), null);
  assert.equal(service.occurrence("conference-public", "2026-10-18").title, conference.title);
});

test("start matching opens one hour before a meeting and closes at its scheduled end", () => {
  const schedule = {
    id: "weekly",
    publicId: "weekly-public",
    channelId: "stakecenter",
    unitId: unit.id,
    title: "Sacrament Meeting",
    kind: "sacrament-meeting",
    timeZone: "America/New_York",
    recurrence: "weekly",
    weekday: 0,
    localDate: null,
    localStartTime: "11:00",
    durationMinutes: 90,
    enabled: true,
  };
  const service = new ScheduleService(store([schedule]));

  assert.equal(
    service.matching({
      unitIds: [unit.id],
      channelId: "stakecenter",
      at: new Date("2026-10-18T14:15:00Z"),
    }).length,
    1,
  );
  assert.equal(
    service.matching({
      unitIds: [unit.id],
      channelId: "stakecenter",
      at: new Date("2026-10-18T13:59:00Z"),
    }).length,
    0,
  );
  assert.equal(
    service.matching({
      unitIds: [unit.id],
      channelId: "stakecenter",
      at: new Date("2026-10-18T16:31:00Z"),
    }).length,
    0,
  );
});
