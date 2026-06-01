# Routines

## Process Diary Routine

Whenever approximately a day's worth of work is completed, create a new diary record in `docs/diary/`.

This includes work such as:

- implementing a feature
- debugging a meaningful issue
- refactoring a substantial area
- doing planning or technical investigation that affected decisions

The record does not need to be long, but it should be specific enough to explain:

- what was done
- why it was done that way
- what problems came up
- what should happen next

Use `docs/templates/DIARY.template.md` as the base for each new record.


## QA Routines

Run the full QA suite with:

```bash
pnpm qa
```

This umbrella script runs all QA categories sequentially and collects reports into a `.qa/` directory. It exits non-zero on any failure, making it suitable as a CI gate.

### Individual QA Scripts

| Script | What it does | Report output |
|--------|-------------|---------------|
| `pnpm qa:performance` | Runs Lighthouse CI against all locales, asserts Performance ≥ 90, LCP ≤ 2.5s, TBT ≤ 200ms, CLS ≤ 0.1 | `lhci-reports/` |
| `pnpm qa:a11y` | Runs axe-core accessibility scans against all pages, asserts 0 critical/serious WCAG violations | Playwright HTML report |
| `pnpm qa:seo` | Runs Lighthouse SEO audit (placeholder — will be wired in a future slice) | — |
| `pnpm qa:security` | Runs `pnpm audit --audit-level high`, exits non-zero on critical/high CVEs | Terminal output |
| `pnpm qa:bundle` | Runs bundle analysis (placeholder — will be wired in a future slice) | — |
| `pnpm qa:cross-browser` | Runs full Playwright suite across Chromium, Firefox, and WebKit | Playwright HTML report |

### Interpreting Reports

After `pnpm qa` completes:

1. Open `.qa/<timestamp>/` for the collected report bundle.
2. Playwright HTML reports are in the `playwright-report/` subdirectory.
3. Lighthouse reports are in the `lhci-reports/` subdirectory.
4. Each QA category's terminal output is in `<category>.log` files.

## QA Delivery Package

The `.qa/` directory is the QA delivery package — the artifact an Agency screenshots into a Client deck.

### What to capture

For each QA run, the `.qa/<timestamp>/` directory contains:

- **Playwright HTML report** — interactive report showing all E2E test results across browsers
- **Lighthouse reports** — per-URL performance audits with scores and metrics
- **Category logs** — terminal output from each `qa:*` script for audit trails

### How to present

1. Run `pnpm qa` against the production build.
2. Open the Playwright HTML report in a browser and screenshot the summary view.
3. Open each Lighthouse HTML report and screenshot the score gauges.
4. Copy the terminal summary output showing all ✅ passes.
5. Compile screenshots into a Client deck with date, project name, and pass/fail status.

### Conventions

- Reports are local HTML files — no hosted dashboards.
- Each QA run creates a timestamped directory (format: `YYYYMMDD-HHMMSS`).
- Old reports are not automatically cleaned up — delete manually or before releases.
- `.qa/` is gitignored and never committed to the repository.

## Manual Cross-Browser Testing Checklist

Automated tests cover Chromium, Firefox, and WebKit via Playwright. The following browsers require manual verification:

### Desktop Browsers

- [ ] **Chrome** (latest) — Layout, interactions, fonts
- [ ] **Safari** (latest) — Layout, interactions, font rendering, scroll behavior
- [ ] **Firefox** (latest) — Layout, interactions, form elements
- [ ] **Edge** (latest) — Layout, interactions (Chromium-based, low-risk)

### Mobile Browsers

- [ ] **Safari iOS** (latest) — Touch targets, viewport scaling, safe areas
- [ ] **Chrome Android** (latest) — Touch targets, viewport scaling
- [ ] **Samsung Internet** (latest) — Layout, font rendering

### What to check on each browser

1. Homepage renders correctly with all sections visible
2. Navigation works (links, language switcher)
3. Responsive breakpoints hold (320px, 375px, 768px, 1280px, 1440px)
4. Images load and are properly sized
5. Fonts render correctly (check for FOUT/FOIT)
6. Focus rings are visible on keyboard navigation
7. No horizontal overflow at any viewport
8. Contact form (when present) submits correctly

### When to test manually

- Before each Client delivery
- After significant CSS/layout changes
- When adding new browser-specific polyfills or features