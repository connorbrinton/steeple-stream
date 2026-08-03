import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { MediaMtxManager } from "../src/mediamtxManager.js";

test("writes MediaMTX config into Steeple Stream data paths", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-mediamtx-test-"));
  const manager = new MediaMtxManager({
    autoStart: false,
    runtime: "auto",
    nixPackage: "nixpkgs#mediamtx",
    binaryPath: null,
    version: "v1.19.2",
    cacheDir: path.join(dir, "bin"),
    configPath: path.join(dir, "mediamtx.yml"),
    recordingsDir: path.join(dir, "recordings")
  });

  await manager.writeConfig();

  const config = await fs.readFile(path.join(dir, "mediamtx.yml"), "utf8");
  assert.match(config, /api: yes/);
  assert.match(config, /hlsVariant: lowLatency/);
  assert.match(config, /stakecenter:/);
  assert.match(config, /recordFormat: fmp4/);
});

test("resolves forced Nix runtime to nix shell command", async () => {
  const manager = new MediaMtxManager({
    autoStart: false,
    runtime: "nix",
    nixPackage: "nixpkgs#mediamtx",
    binaryPath: null,
    version: "v1.19.2",
    cacheDir: "/tmp/unused",
    configPath: "/tmp/unused/mediamtx.yml",
    recordingsDir: "/tmp/unused/recordings"
  });

  const command = await manager.resolveCommand();
  assert.equal(command.runtime, "nix");
  assert.match(command.command, /nix$/);
  assert.deepEqual(command.args, ["shell", "nixpkgs#mediamtx", "--command", "mediamtx"]);
});
