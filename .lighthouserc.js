/**
 * Lighthouse CI configuration.
 *
 * Runs against the production build served by `pnpm start` (Next.js server).
 *
 * Thresholds (per Acceptance Criteria #2):
 *   - Performance score  >= 90
 *   - LCP                 <= 2500 ms
 *   - INP                 <= 200 ms  (TBT is the lab proxy, also bounded to 200 ms)
 *   - CLS                 <= 0.1
 *
 * INP is a field/RUM metric; Lighthouse lab data does not report INP directly.
 * Total Blocking Time (TBT) is the lab correlate for main-thread responsiveness
 * and is bounded to 200 ms as the lab proxy for the INP threshold.
 *
 * HTML reports are written to `lhci-reports/` (gitignored).
 */
module.exports = {
  ci: {
    collect: {
      // Boot the Next.js production server before auditing.
      startServerCommand: "pnpm build && pnpm start",
      // Pattern that indicates the server is ready to accept connections.
      startServerReadyPattern: "Ready|started server|Local:",
      // Pages to audit — currently the homepage in all three locales.
      // When the Hotel Example grows (rooms, contact), append those URLs here.
      url: [
        "http://localhost:3000/en",
        "http://localhost:3000/el",
        "http://localhost:3000/de",
      ],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        // Score thresholds (0–1 range).
        "categories:performance": ["error", { minScore: 0.9 }],
        // Core Web Vitals + lab correlate for INP.
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        // Accessibility and best-practice are advisory only.
        "categories:accessibility": ["warn", { minScore: 0.95 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "lhci-reports",
      reportFilenamePattern: "%%PATH%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};
