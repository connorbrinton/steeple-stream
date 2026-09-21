import assert from "node:assert/strict";
import test from "node:test";
import { BroadcastStartResolver } from "../src/broadcastStartResolver.js";

const units = [
  {
    id: "ward-a",
    name: "Ward A",
    slug: "ward-a",
    type: "ward",
    parentUnitId: null,
    archivedAt: null,
  },
  {
    id: "ward-b",
    name: "Ward B",
    slug: "ward-b",
    type: "ward",
    parentUnitId: null,
    archivedAt: null,
  },
];
const principal = { email: "person@example.com", role: "operator" };

function occurrence(unit, overrides = {}) {
  return {
    key: `schedule-${unit.id}/2026-09-20`,
    scheduleId: `schedule-${unit.id}`,
    schedulePublicId: `public-${unit.id}`,
    channelId: "stakecenter",
    unit,
    title: `${unit.name} Sacrament Meeting`,
    kind: "sacrament-meeting",
    scheduledStart: "2026-09-20T15:00:00Z",
    scheduledEnd: "2026-09-20T16:30:00Z",
    localDate: "2026-09-20",
    href: `/broadcasts/public-${unit.id}/2026-09-20`,
    ...overrides,
  };
}

function resolver(matches, assigned = units.map((unit) => unit.id)) {
  return new BroadcastStartResolver(
    { listUnits: () => units },
    { unitIdsFor: () => assigned },
    { matching: () => matches },
    "stakecenter",
  );
}

test("a scheduled occurrence identifies one unit without prompting", () => {
  const result = resolver([occurrence(units[1])]).resolve(
    principal,
    undefined,
    new Date("2026-09-20T15:00:00Z"),
  );
  assert.equal(result.status, "ready");
  assert.equal(result.association.unitId, "ward-b");
  assert.equal(result.association.occurrenceKey, "schedule-ward-b/2026-09-20");
});

test("multiple plausible units require unit selection but never schedule selection", () => {
  const result = resolver([occurrence(units[0]), occurrence(units[1])]).resolve(principal);
  assert.equal(result.status, "unit-selection-required");
  assert.deepEqual(
    result.units.map((unit) => unit.id),
    ["ward-a", "ward-b"],
  );
});

test("multiple schedules for one unit choose the nearest occurrence", () => {
  const farther = occurrence(units[0], {
    key: "farther/2026-09-20",
    scheduledStart: "2026-09-20T14:00:00Z",
  });
  const nearer = occurrence(units[0], {
    key: "nearer/2026-09-20",
    scheduledStart: "2026-09-20T15:00:00Z",
  });
  const result = resolver([nearer, farther]).resolve(
    principal,
    undefined,
    new Date("2026-09-20T14:55:00Z"),
  );
  assert.equal(result.status, "ready");
  assert.equal(result.association.occurrenceKey, "nearer/2026-09-20");
});

test("an explicit eligible unit resolves an otherwise unscheduled ambiguity", () => {
  const ambiguous = resolver([]).resolve(principal);
  assert.equal(ambiguous.status, "unit-selection-required");

  const selected = resolver([]).resolve(principal, "ward-b");
  assert.equal(selected.status, "ready");
  assert.equal(selected.association.unitId, "ward-b");
  assert.equal(selected.association.scheduleId, null);
});

test("a broadcaster cannot select an unassigned unit", () => {
  assert.throws(() => resolver([], ["ward-a"]).resolve(principal, "ward-b"), /not assigned/);
});

test("administrators also require explicit unit assignments once units exist", () => {
  assert.throws(
    () => resolver([], []).resolve({ ...principal, role: "administrator" }),
    /No active units are assigned/,
  );
});
