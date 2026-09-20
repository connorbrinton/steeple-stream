import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./specs",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        launchOptions: {
          args: ["--autoplay-policy=no-user-gesture-required"],
        },
      },
    },
    { name: "firefox", testIgnore: "**/streaming.spec.js", use: { browserName: "firefox" } },
    { name: "webkit", testIgnore: "**/streaming.spec.js", use: { browserName: "webkit" } },
  ],
  webServer: {
    command: "node server.js",
    url: "http://127.0.0.1:4173/ready",
    timeout: 90_000,
    reuseExistingServer: false,
    stdout: "pipe",
    stderr: "pipe",
  },
});
