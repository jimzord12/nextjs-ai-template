import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated WCAG 2.2 AA accessibility scans for the Hotel Example surface.
 *
 * Uses @axe-core/playwright (AxeBuilder) to analyze each page and assert
 * that there are ZERO critical or serious violations. Minor (minor) and
 * moderate violations are reported but do not fail the test.
 *
 * Run with:  pnpm qa:a11y
 *
 * Coverage:
 *   - Homepage in all three locales: en, el, de
 *   - 404 (not-found) page
 *
 * When additional Hotel Example pages come online (rooms listing, room
 * detail, contact), extend the `routes` table below — the assertion
 * shape does not change.
 */

const routes: Array<{ name: string; path: string }> = [
  { name: "homepage (en)", path: "/en" },
  { name: "homepage (el)", path: "/el" },
  { name: "homepage (de)", path: "/de" },
  { name: "404 (not-found)", path: "/en/this-route-does-not-exist" },
];

// Axe produces actionable failure output; we serialize the blocking
// violations into the test error so CI logs name the rule, the help text,
// and the offending CSS selectors.
function formatViolations(
  violations: Array<{
    id: string;
    impact?: string | null;
    help: string;
    description: string;
    nodes: Array<{ target: Array<string | string[]> }>;
  }>,
): string {
  return violations
    .map((v) => {
      const nodes = v.nodes
        .map((n) => `    - ${n.target.join(" > ")}`)
        .join("\n");
      return `  [${v.impact}] ${v.id}: ${v.help}\n    ${v.description}\n${nodes}`;
    })
    .join("\n");
}
// Disable parallelism so the production server boots once and tests run
// sequentially — keeps cold-start jitter out of timing-sensitive assertions.
test.describe.configure({ mode: "serial" });

for (const { name, path } of routes) {
  test(`${name} has no critical/serious a11y violations`, async ({ page }) => {
    await page.goto(path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    if (blocking.length > 0) {
      throw new Error(
        `Found ${blocking.length} critical/serious a11y violations on ${path}:\n${formatViolations(blocking)}`,
      );
    }

    expect(blocking).toEqual([]);
  });
}
