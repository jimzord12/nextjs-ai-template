import { expect, test } from "@playwright/test";

/**
 * Responsive viewport smoke tests for the Hotel Example homepage.
 *
 * Verifies the page renders without horizontal overflow at common
 * viewport sizes from small mobile (320px) to large desktop (1440px).
 *
 * Run with:  pnpm qa:cross-browser
 *            pnpm test:e2e
 */

const viewports = [
  { name: "mobile-small", width: 320, height: 576 },
  { name: "mobile-medium", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 720 },
  { name: "desktop-large", width: 1440, height: 900 },
];

// Run sequentially — keeps cold-start jitter out of assertions.
test.describe.configure({ mode: "serial" });

for (const viewport of viewports) {
  test(`homepage renders correctly at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    const response = await page.goto("/en");
    expect(response).not.toBeNull();
    // biome-ignore lint/style/noNonNullAssertion: guarded by not.toBeNull() above
    expect(response!.status()).toBe(200);

    // No horizontal overflow: scroll width must not exceed viewport width.
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    // Main content is visible — the page has visible text content.
    await expect(page.locator("body")).toBeVisible();
  });
}
