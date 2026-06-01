Status: ready-for-agent
Method: chore
Complexity: 2

# QA Gate 2 — SEO

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Add `pnpm qa:seo` script that runs a Lighthouse SEO audit targeting score 100. Verify that the SEO routes from S7 (robots.txt, sitemap.xml, JSON-LD, hreflang) all pass Lighthouse SEO checks.

## Acceptance criteria

- [ ] `pnpm qa:seo` script runs Lighthouse SEO audit
- [ ] Lighthouse SEO score targets 100 across all Hotel Example pages
- [ ] SEO audit verifies: meta tags, canonical URLs, hreflang, structured data, robots.txt, sitemap.xml
- [ ] `pnpm qa:seo` outputs HTML report
- [ ] `pnpm qa:seo` passes against the Hotel Example

## Blocked by

- `08-seo-routes` — needs robots.ts, sitemap.ts, JSON-LD, hreflang to audit
- `11-playwright-e2e` — needs Playwright infrastructure for Lighthouse integration

## Further Notes

This is a thin slice — the heavy lifting is in `08-seo-routes` (implementing SEO features) and `11-playwright-e2e` (Playwright infrastructure). This slice wires the Lighthouse SEO audit and verifies everything scores well.
