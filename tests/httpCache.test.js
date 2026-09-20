import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { sendJson, sendStatic, proxyHttp } from "../src/httpUtils.js";

async function serve(t, handler) {
  const server = http.createServer((req, res) =>
    Promise.resolve(handler(req, res)).catch(() => {
      res.writeHead(500);
      res.end();
    }),
  );
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );
  return `http://127.0.0.1:${server.address().port}`;
}

test("frontend URLs change with contents and responses cannot be cached", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-cache-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  await fs.mkdir(path.join(dir, "assets"));
  await fs.writeFile(
    path.join(dir, "index.html"),
    '<script src="/assets/app.js?v=__ASSET_VERSION__"></script>',
  );
  await fs.writeFile(path.join(dir, "assets/app.js"), 'window.version="one";');
  const url = await serve(t, (req, res) =>
    sendStatic(res, dir, new URL(req.url, "http://localhost").pathname),
  );
  const first = await fetch(url);
  assert.equal(first.headers.get("cache-control"), "private, no-store");
  assert.equal(first.headers.get("cdn-cache-control"), "no-store");
  const html = await first.text();
  assert.match(html, /app\.js\?v=[a-f0-9]{20}/);
  assert.equal(Number(first.headers.get("content-length")), Buffer.byteLength(html));
  assert.equal(await (await fetch(url)).text(), html);
  const asset = /src="([^"]+)"/.exec(html)[1];
  const script = await fetch(url + asset);
  assert.equal(script.headers.get("cache-control"), "private, no-store");
  assert.equal(await script.text(), 'window.version="one";');
  // Same-size edits must change the URL without restarting the server.
  await fs.writeFile(path.join(dir, "assets/app.js"), 'window.version="two";');
  assert.notEqual(await (await fetch(url)).text(), html);
  const missing = await fetch(url + "/missing.js");
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get("cache-control"), "private, no-store");
});

test("all page templates version their scripts and stylesheets", async (t) => {
  const url = await serve(t, (req, res) => sendStatic(res, path.resolve("public"), req.url));
  for (const name of ["admin", "broadcaster", "viewer"]) {
    const body = await (await fetch(`${url}/${name}.html`)).text();
    assert.ok(!body.includes("__ASSET_VERSION__"));
    const urls = [
      ...body.matchAll(
        /(?:src|href)="((?:\/assets\/|\/build\/|\/vendor\/)[^"]+\.(?:js|css)[^"]*)"/g,
      ),
    ].map((match) => match[1]);
    assert.deepEqual(
      urls.map((asset) => asset.replace(/\?v=.*/, "")),
      ["/build/app.css", "/vendor/hls.min.js", `/build/${name}.js`],
    );
    for (const asset of urls) assert.match(asset, /\?v=[a-f0-9]{20}$/);
  }
});

test("API responses are uncached while proxied media keeps its cache policy", async (t) => {
  const upstream = await serve(t, (_req, res) => {
    res.writeHead(200, { "cache-control": "public, max-age=60", "content-type": "video/mp4" });
    res.end("segment");
  });
  const url = await serve(t, (req, res) =>
    req.url === "/api/session"
      ? sendJson(res, 200, { role: "administrator" })
      : proxyHttp(req, res, upstream, "/segment"),
  );
  assert.equal(
    (await fetch(url + "/api/session")).headers.get("cache-control"),
    "private, no-store",
  );
  const segment = await fetch(url + "/media");
  assert.equal(segment.headers.get("cache-control"), "public, max-age=60");
  assert.equal(await segment.text(), "segment");
});
