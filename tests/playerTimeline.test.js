import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import fs from "node:fs/promises";

const context = vm.createContext({ window: {} });
vm.runInContext(
  await fs.readFile(new URL("../.test-build/player.js", import.meta.url), "utf8"),
  context,
);

test("HLS history uses advertised dated complete segments, not meeting elapsed time", () => {
  const start = Date.parse("2026-09-14T10:30:00Z");
  const range = context.hlsPlaylistWindow(
    '#EXTM3U\n#EXT-X-PROGRAM-DATE-TIME:2026-09-14T10:30:00Z\n#EXTINF:2.5,\na.mp4\n#EXTINF:3,\nb.mp4\n#EXT-X-PART:DURATION=0.2,URI="next.mp4"',
  );
  assert.equal(range.start, start);
  assert.equal(range.end, start + 5500);
});
test("undated, invalid and empty playlists do not invent a rewind window", () => {
  for (const text of [
    "",
    "#EXTM3U\n#EXTINF:2,\na.mp4",
    "#EXT-X-PROGRAM-DATE-TIME:bad\n#EXTINF:2,\na.mp4",
  ]) {
    assert.equal(context.hlsPlaylistWindow(text), null);
  }
});
test("variant selection supports relative paths and media playlists", () => {
  assert.equal(
    context.hlsVariant("#EXTM3U\r\n#EXT-X-STREAM-INF:BANDWIDTH=1000\r\n\r\nstream.m3u8"),
    "stream.m3u8",
  );
  assert.equal(context.hlsVariant("#EXTM3U\n#EXTINF:2,\nsegment.mp4"), null);
});
