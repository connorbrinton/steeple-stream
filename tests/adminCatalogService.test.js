import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { AdminCatalogService } from "../src/adminCatalogService.js";
import { SqliteStore } from "../src/sqliteStore.js";

async function fixture() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-admin-catalog-"));
  const store = new SqliteStore(path.join(dir, "state.sqlite"));
  await store.load();
  return { store, service: new AdminCatalogService(store, "stakecenter") };
}

test("admin catalog creates and updates units and schedules", async () => {
  const { service } = await fixture();
  const unit = service.saveUnit({
    slug: "harris-lake",
    name: "Harris Lake Ward",
    type: "ward",
    parentUnitId: null,
  });
  const schedule = service.saveSchedule({
    unitId: unit.id,
    title: "Sacrament Meeting",
    kind: "sacrament-meeting",
    timeZone: "America/New_York",
    recurrence: "weekly",
    weekday: 0,
    localStartTime: "11:00",
    durationMinutes: 90,
    enabled: true,
  });
  const updated = service.saveSchedule(
    { ...schedule, title: "Ward Sacrament Meeting" },
    schedule.id,
  );

  assert.equal(updated.title, "Ward Sacrament Meeting");
  assert.equal(updated.publicId, schedule.publicId);
  assert.equal(updated.channelId, "stakecenter");
  assert.deepEqual(service.list().units, [unit]);
});

test("admin catalog rejects duplicate slugs and invalid schedules", async () => {
  const { service } = await fixture();
  const unit = service.saveUnit({ slug: "harris-lake", name: "Harris Lake", type: "ward" });
  assert.throws(
    () => service.saveUnit({ slug: "harris-lake", name: "Another Ward", type: "ward" }),
    (error) => error.status === 409,
  );
  assert.throws(
    () =>
      service.saveSchedule({
        unitId: unit.id,
        title: "Meeting",
        kind: "other",
        timeZone: "not/a-zone",
        recurrence: "weekly",
        weekday: 0,
        localStartTime: "11:00",
        durationMinutes: 60,
      }),
    /valid IANA time zone/,
  );
});
