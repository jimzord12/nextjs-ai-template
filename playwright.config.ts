import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // biome-ignore lint/style/noProcessEnv: CI detection is the standard Playwright pattern
  forbidOnly: !!process.env.CI,
  // biome-ignore lint/style/noProcessEnv: CI detection is the standard Playwright pattern
  retries: process.env.CI ? 2 : 0,
  // biome-ignore lint/style/noProcessEnv: CI detection is the standard Playwright pattern
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "pnpm build && pnpm start",
    port: 3000,
    // biome-ignore lint/style/noProcessEnv: CI detection is the standard Playwright pattern
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
