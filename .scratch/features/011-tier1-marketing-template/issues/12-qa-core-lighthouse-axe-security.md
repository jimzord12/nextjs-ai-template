Method: scaffold
Status: ready-for-agent
Complexity: 3
BlockedBy: 8, 9, 11

# QA core: Lighthouse + axe-core + security audit

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Wire the core QA checks that run before every deployment. These verify performance, accessibility, and security at the threshold level. A `pnpm qa` umbrella script runs all checks and exits non-zero on any failure.

**Lighthouse performance** — Run against built static pages. Thresholds: Performance ≥ 90, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Use Lighthouse CLI or Programmatic API.

**Accessibility (axe-core + Playwright)** — Run axe-core against all pages in all locales. Assert zero critical/serious WCAG 2.2 AA violations. Integrate with existing Playwright setup.

**Security audit** — `pnpm audit` with `--audit-level critical`. Fail on critical CVEs. Already partially wired (`pnpm qa:security`).

**Umbrella script** — `pnpm qa` runs: typecheck, lint, test, build, Lighthouse, axe-core, security audit. Exits non-zero on any failure. Individual scripts remain available for targeted runs.

## Acceptance criteria

- [ ] `pnpm qa` umbrella script runs all checks sequentially, exits non-zero on failure
- [ ] Lighthouse performance thresholds enforced: Perf ≥ 90, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- [ ] axe-core runs against all pages in all locales with Playwright
- [ ] Zero critical/serious WCAG 2.2 AA violations
- [ ] Security audit fails on critical CVEs (`--audit-level critical`)
- [ ] Individual QA scripts still available (`pnpm qa:performance`, `pnpm qa:a11y`, `pnpm qa:security`)
- [ ] QA runs against the built `out/` directory (static export)
- [ ] `pnpm qa` passes on the current template with seed content
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `08-testimonials-faq-slices` — needs all slice components for accurate Lighthouse/axe testing
- `09-cta-band-formspree` — needs CTA form for accessibility testing
- `11-seo-metadata-sitemap` — needs complete pages with SEO for meaningful QA
