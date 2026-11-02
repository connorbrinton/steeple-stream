import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const publicDir = resolve(import.meta.dirname, "../../public");
const buildDir = resolve(publicDir, "build");
const revision = (file: string) =>
  createHash("sha256")
    .update(readFileSync(resolve(publicDir, file)))
    .digest("hex");

/**
 * The web application has multiple entry points, but offline support is deliberately
 * limited to broadcaster controls. Media and viewer/admin modules are not precached.
 */
function broadcasterFiles(): Set<string> {
  type Entry = {
    name?: string;
    isEntry?: boolean;
    file: string;
    imports?: string[];
    css?: string[];
    assets?: string[];
  };
  const manifest = JSON.parse(
    readFileSync(resolve(buildDir, ".vite/manifest.json"), "utf8"),
  ) as Record<string, Entry>;
  const root = Object.keys(manifest).find(
    (key) => manifest[key]?.isEntry && manifest[key]?.name === "broadcaster",
  );
  if (!root) throw new Error("Broadcaster entry missing from Vite's build manifest");

  const required = new Set<string>(["app.css"]);
  const visited = new Set<string>();
  const visit = (key: string): void => {
    if (visited.has(key)) return;
    visited.add(key);
    const entry = manifest[key];
    if (!entry) throw new Error(`Missing Vite manifest dependency: ${key}`);
    required.add(entry.file);
    for (const file of [...(entry.css || []), ...(entry.assets || [])]) required.add(file);
    for (const dependency of entry.imports || []) visit(dependency);
    // Dynamic imports (particularly video playback) are intentionally excluded.
  };
  visit(root);
  return required;
}

export default defineConfig({
  publicDir: false,
  plugins: [
    VitePWA({
      strategies: "injectManifest",
      srcDir: "tools/player-ui",
      filename: "sw.js",
      injectRegister: false,
      registerType: "prompt",
      manifest: false,
      scope: "/",
      base: "/build/",
      injectManifest: {
        globPatterns: ["**/*.{js,css,svg,png,webp,woff2}"],
        additionalManifestEntries: [
          { url: "/operator-shell", revision: revision("broadcaster.html") },
          { url: "/assets/early-play.js", revision: revision("assets/early-play.js") },
        ],
        manifestTransforms: [
          async (entries) => {
            const required = broadcasterFiles();
            return {
              manifest: entries.filter((entry) => {
                const filename = new URL(entry.url, "https://example.invalid").pathname.replace(
                  /^\/build\//,
                  "",
                );
                return (
                  required.has(filename) ||
                  entry.url.startsWith("/operator-shell") ||
                  entry.url.startsWith("/assets/early-play.js")
                );
              }),
              warnings: [],
            };
          },
        ],
      },
    }),
  ],
  build: {
    manifest: true,
    outDir: buildDir,
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        admin: resolve(import.meta.dirname, "entries/admin.ts"),
        broadcaster: resolve(import.meta.dirname, "entries/broadcaster.ts"),
        landing: resolve(import.meta.dirname, "../../frontend/entries/landing.tsx"),
        manage: resolve(import.meta.dirname, "../../frontend/entries/manage.tsx"),
        player: resolve(import.meta.dirname, "entries/player.ts"),
        viewer: resolve(import.meta.dirname, "entries/viewer.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: (asset) =>
          asset.name === "style.css" ? "app.css" : "assets/[name]-[hash][extname]",
      },
    },
  },
});
