Status: done
Method: chore
Complexity: 2
BlockedBy: 8,11

# QA Gate 2 — SEO

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Add `pnpm qa:seo` script that runs a Lighthouse SEO audit targeting score 100. Verify that the SEO routes from S7 (robots.txt, sitemap.xml, JSON-LD, hreflang) all pass Lighthouse SEO checks.

## Acceptance criteria

- [x] `pnpm qa:seo` script runs Lighthouse SEO audit
- [x] Lighthouse SEO score meets the configured gate threshold across all Hotel Example pages
- [x] SEO audit verifies: meta tags, canonical URLs, hreflang, structured data, robots.txt, sitemap.xml
- [x] `pnpm qa:seo` outputs HTML report
- [x] `pnpm qa:seo` passes against the Hotel Example

## Blocked by

- `08-seo-routes` — needs robots.ts, sitemap.ts, JSON-LD, hreflang to audit
- `11-playwright-e2e` — needs Playwright infrastructure for Lighthouse integration

## Further Notes

This is a thin slice — the heavy lifting is in `08-seo-routes` (implementing SEO features) and `11-playwright-e2e` (Playwright infrastructure). This slice wires the Lighthouse SEO audit and verifies everything scores well.

