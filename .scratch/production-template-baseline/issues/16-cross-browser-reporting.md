Status: ready-for-agent

# QA Gate 4 — Cross-Browser + Reporting

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Add responsive viewport smoke tests at 320px, 375px, 768px, 1280px, and 1440px. Add `pnpm qa:cross-browser` script that runs the full Playwright suite across all browser projects. Create the `pnpm qa` umbrella script that runs all `qa:*` scripts and exits non-zero on any failure. Create `scripts/qa-report.sh` that runs all QA categories sequentially and collects reports into a `.qa/` directory. Document the QA delivery package format — what to capture, how to present to a Client, and shareable conventions. Add a manual cross-browser testing checklist (Chrome, Safari, Firefox, Edge, Samsung Internet).

## Acceptance criteria

- [ ] Responsive viewport smoke tests at 320px, 375px, 768px, 1280px, 1440px pass
- [ ] `pnpm qa:cross-browser` runs full Playwright suite across Chromium, Firefox, WebKit
- [ ] `pnpm qa` umbrella script runs all `qa:*` scripts (`qa:performance`, `qa:a11y`, `qa:seo`, `qa:security`, `qa:bundle`, `qa:cross-browser`)
- [ ] `pnpm qa` exits non-zero on any failure — suitable as CI gate
- [ ] `scripts/qa-report.sh` collects all reports into `.qa/` directory
- [ ] QA delivery package format documented: what to capture, how to present, conventions
- [ ] Manual cross-browser testing checklist documented
- [ ] `pnpm qa` passes against the Hotel Example

## Blocked by

- `13-performance-accessibility` — needs Playwright axe integration and Lighthouse CI as foundation

## Further Notes

This is the final QA gate. After this slice, the full QA pipeline is operational. The `.qa/` output is what the Agency screenshots into a Client deck.
