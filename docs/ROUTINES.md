# Routines

## QA Routines

Run the full QA suite with:

```bash
pnpm qa
```

This umbrella script runs all QA categories sequentially and collects reports into a `.qa/` directory. It exits non-zero on any failure, making it suitable as a CI gate.

### Individual QA Scripts

| Script                  | What it does                                                                                    | Report output                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `pnpm qa:performance`   | Runs Unlighthouse against the production build and enforces Performance budget ≥ 90             | `.unlighthouse/`                                     |
| `pnpm qa:a11y`          | Runs axe-core accessibility scans against all pages, asserts 0 critical/serious WCAG violations | Playwright HTML report                               |
| `pnpm qa:seo`           | Runs Lighthouse SEO audits against all locale pages, asserts each page meets SEO score ≥ 80     | `.qa/seo-result-<locale>.report.html`, `.qa/seo-summary.json` |
| `pnpm qa:security`      | Runs `pnpm audit --audit-level high`, exits non-zero on critical/high CVEs                      | Terminal output                                      |
| `pnpm qa:bundle`        | Runs bundle analysis via `@next/bundle-analyzer` (sets `ANALYZE=true`), opens interactive client/bundle size report in browser | Browser (client/server bundle treemaps)              |
| `pnpm qa:cross-browser` | Runs full Playwright suite across Chromium, Firefox, and WebKit                                 | Playwright HTML report                               |
| `pnpm qa:doctor`        | Runs `react-doctor` score check, asserts score meets threshold (default: 80, configurable via `REACT_DOCTOR_THRESHOLD`) | Terminal output                                      |

### Additional Analysis Scripts

| Script          | What it does                                                       |
| --------------- | ------------------------------------------------------------------ |
| `pnpm analyze`  | Alias for `ANALYZE=true pnpm build` — runs `@next/bundle-analyzer` |
| `pnpm doctor`   | Runs `react-doctor` interactively (no threshold enforcement)       |

### Interpreting Reports

After `pnpm qa` completes:

1. Open `.qa/<timestamp>/` for the collected report bundle.
2. Playwright HTML reports are in the `playwright-report/` subdirectory.
3. Unlighthouse report artifacts are in the `unlighthouse-report/` subdirectory.
4. SEO reports are per-locale Lighthouse HTML files in `.qa/`.
5. Each QA category's terminal output is in `<category>.log` files.

## QA Delivery Package

The `.qa/` directory is the QA delivery package — the artifact an Agency screenshots into a Client deck.

### What to capture

For each QA run, the `.qa/<timestamp>/` directory contains:

- **Playwright HTML report** — interactive report showing all E2E test results across browsers
- **Unlighthouse reports** — site-wide performance audits with scores and metrics
- **SEO reports** — per-locale Lighthouse SEO audit HTML files
- **Category logs** — terminal output from each `qa:*` script for audit trails

### How to present

1. Run `pnpm qa` against the production build.
2. Open the Playwright HTML report in a browser and screenshot the summary view.
3. Open the Unlighthouse report and screenshot the score gauges.
4. Open the SEO Lighthouse reports and screenshot the SEO scores.
5. Copy the terminal summary output showing all passes.
6. Compile screenshots into a Client deck with date, project name, and pass/fail status.

### Conventions

- Reports are local HTML files — no hosted dashboards.
- Each QA run creates a timestamped directory (format: `YYYYMMDD-HHMMSS`).
- Old reports are not automatically cleaned up — delete manually or before releases.
- `.qa/` is gitignored and never committed to the repository.

## Git Routines

### Pruning merged local branches

Run `pnpm git:prune` to safely delete all local branches that have been fully merged into `main`.

| Flag        | What it does                                      |
| ----------- | ------------------------------------------------- |
| (none)      | Lists merged branches and asks for confirmation   |
| `--dry-run` | Shows what would be deleted without deleting      |

The script always protects `main`, `master`, and the current branch from deletion. It detects both fast-forward merges and GitHub squash merges.

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
