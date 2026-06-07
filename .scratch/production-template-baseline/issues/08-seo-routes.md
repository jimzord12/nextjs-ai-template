Status: done
Method: scaffold
Complexity: 2
BlockedBy: 6,7

# SEO Routes (robots, sitemap, JSON-LD, hreflang)

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Add SEO infrastructure that covers all Hotel Example pages: `robots.ts` and `sitemap.ts` route handlers generating correct static files, JSON-LD structured data (Organization, WebSite, BreadcrumbList) in the Homepage and Room pages, and hreflang support with localized canonical/alternate URL patterns consistent with the `next-intl` routing. Update `generateMetadata` on all pages to include alternate language links.

## Acceptance criteria

- [x] `robots.ts` generates a correct `robots.txt` static file
- [x] `sitemap.ts` generates a correct `sitemap.xml` including all pages across all locales
- [x] JSON-LD structured data present on Homepage: Organization and WebSite schemas
- [x] JSON-LD structured data present on Room detail: BreadcrumbList schema
- [x] `hreflang` link tags present in all page `<head>` sections pointing to all locale variants
- [x] Canonical URLs include the locale prefix
- [x] `generateMetadata` on all pages includes alternate language links
- [x] `next build` succeeds and produces `robots.txt` and `sitemap.xml`

## Blocked by

- `06-hotel-homepage` — needs Homepage page to add structured data
- `07-hotel-rooms` — needs Room pages to add structured data and sitemap entries
