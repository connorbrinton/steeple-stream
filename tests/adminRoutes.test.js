import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { handleAdminRoutes } from "../src/http/adminRoutes.js";

async function fixture(t) {
  const calls = [];
  const dependencies = {
    auth: {
      authorize(_req, role, options) {
        calls.push(["authorize", role, options?.csrfRequired ?? false]);
      },
    },
    adminCatalog: {
      list: () => ({ units: ["ward"], schedules: [] }),
      saveUnit: (body, id) => {
        calls.push(["saveUnit", body, id]);
        return { id: id || "created", ...body };
      },
      saveSchedule: (body, id) => ({ id: id || "created", ...body }),
    },
    access: {
      listPeople: () => [{ email: "test@example.com" }],
      save: (body, email) => {
        calls.push(["savePerson", body, email]);
        return { email: email || body.email, ...body };
      },
    },
  };
  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url || "/", "http://localhost").pathname;
    void handleAdminRoutes(req, res, req.method || "GET", pathname, dependencies)
      .then((handled) => {
        if (!handled) {
          res.writeHead(404);
          res.end();
        }
      })
      .catch((error) => {
        res.writeHead(500);
        res.end(String(error));
      });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );
  return { url: `http://127.0.0.1:${server.address().port}`, calls };
}

test("admin catalog route authorizes and returns data", async (t) => {
  const { url, calls } = await fixture(t);
  const response = await fetch(url + "/api/admin/catalog");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { units: ["ward"], schedules: [] });
  assert.deepEqual(calls, [["authorize", "administrator", false]]);
});

test("admin mutations keep their CSRF requirements and route parameters", async (t) => {
  const { url, calls } = await fixture(t);
  const response = await fetch(url + "/api/admin/units/a%2Fb", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Test ward" }),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { id: "a/b", name: "Test ward" });
  assert.deepEqual(calls, [
    ["authorize", "administrator", true],
    ["saveUnit", { name: "Test ward" }, "a/b"],
  ]);
});

test("admin access routes and unmatched paths", async (t) => {
  const { url, calls } = await fixture(t);
  const people = await fetch(url + "/api/admin/access");
  assert.equal(people.status, 200);
  assert.deepEqual(await people.json(), { people: [{ email: "test@example.com" }] });
  const unrelated = await fetch(url + "/api/health");
  assert.equal(unrelated.status, 404);
  assert.deepEqual(calls, [["authorize", "administrator", false]]);
});
