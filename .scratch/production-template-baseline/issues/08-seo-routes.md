Status: ready-for-agent

# SEO Routes (robots, sitemap, JSON-LD, hreflang)

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Add SEO infrastructure that covers all Hotel Example pages: `robots.ts` and `sitemap.ts` route handlers generating correct static files, JSON-LD structured data (Organization, WebSite, BreadcrumbList) in the Homepage and Room pages, and hreflang support with localized canonical/alternate URL patterns consistent with the `next-intl` routing. Update `generateMetadata` on all pages to include alternate language links.

## Acceptance criteria

- [ ] `robots.ts` generates a correct `robots.txt` static file
- [ ] `sitemap.ts` generates a correct `sitemap.xml` including all pages across all locales
- [ ] JSON-LD structured data present on Homepage: Organization and WebSite schemas
- [ ] JSON-LD structured data present on Room detail: BreadcrumbList schema
- [ ] `hreflang` link tags present in all page `<head>` sections pointing to all locale variants
- [ ] Canonical URLs include the locale prefix
- [ ] `generateMetadata` on all pages includes alternate language links
- [ ] `next build` succeeds and produces `robots.txt` and `sitemap.xml`

## Blocked by

- `06-hotel-homepage` — needs Homepage page to add structured data
- `07-hotel-rooms` — needs Room pages to add structured data and sitemap entries
