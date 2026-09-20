import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { AccessService } from "../src/accessService.js";
import { SqliteStore } from "../src/sqliteStore.js";

async function fixture() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-access-"));
  const store = new SqliteStore(path.join(dir, "state.sqlite"));
  await store.load();
  const unit = store.createUnit({
    id: "unit-1",
    slug: "harris-lake",
    name: "Harris Lake Ward",
    type: "ward",
    parentUnitId: null,
  });
  const service = new AccessService(store, {
    adminEmails: new Set(["connor@example.com"]),
    operatorEmails: new Set(),
  });
  return { service, unit };
}

test("managed people authorize by role and can be immediately disabled", async () => {
  const { service, unit } = await fixture();
  service.save({
    email: "wyatt@example.com",
    role: "broadcaster",
    unitIds: [unit.id],
    enabled: true,
  });
  assert.equal(service.roleFor("WYATT@example.com"), "operator");
  assert.deepEqual(service.unitIdsFor("wyatt@example.com"), [unit.id]);

  service.save(
    {
      email: "wyatt@example.com",
      role: "broadcaster",
      unitIds: [unit.id],
      enabled: false,
    },
    "wyatt@example.com",
  );
  assert.equal(service.roleFor("wyatt@example.com"), null);
});

test("configured administrators remain administrators while accepting unit assignments", async () => {
  const { service, unit } = await fixture();
  const saved = service.save(
    {
      email: "connor@example.com",
      role: "administrator",
      unitIds: [unit.id],
      enabled: true,
    },
    "connor@example.com",
  );
  const listed = service.listPeople().find((person) => person.email === "connor@example.com");

  assert.equal(saved.source, "managed");
  assert.equal(listed.source, "configuration");
  assert.deepEqual(listed.unitIds, [unit.id]);
  assert.equal(service.roleFor("connor@example.com"), "administrator");
  assert.throws(
    () =>
      service.save(
        {
          email: "connor@example.com",
          role: "broadcaster",
          unitIds: [unit.id],
          enabled: true,
        },
        "connor@example.com",
      ),
    /cannot be demoted/,
  );
});

test("people require at least one existing unit", async () => {
  const { service } = await fixture();
  assert.throws(
    () =>
      service.save({
        email: "wyatt@example.com",
        role: "broadcaster",
        unitIds: [],
        enabled: true,
      }),
    /Assign at least one unit/,
  );
});
