Method: tdd
Status: ready-for-agent
Complexity: 3
BlockedBy: 6, 7

# SEO: metadata + sitemap + robots + canonical + hreflang

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Wire all 5 in-scope SEO features using the CMS adapter and content loaders. Everything is generated at build time from content — no runtime SEO.

**Page metadata** — Each Page record includes SEO Content Component (title, description, ogImage?, noindex?). Route handler uses `generateMetadata` to produce per-page metadata. Site Settings provides default OG image and title template for pages without explicit SEO fields.

**sitemap.xml** — Static generation from content loaders × locales at build time. Lists all pages in all configured locales. Generated as part of `generateStaticParams` or a dedicated build step.

**robots.txt** — Static allow-all file in `public/`. Allows all crawlers to index everything.

**Canonical URLs** — Generated per page via `generateMetadata`. Each page gets a canonical pointing to its default-locale URL.

**hreflang tags** — Generated for all locale variants of each page via `generateMetadata`. Each page lists alternate links for all configured locales.

**i18n routing refinements** — Ensure URL-prefixed locales including default (`/en/`, `/el/`, `/de/`). Root `/` redirects to default locale. Single-language sites can configure one locale.

## Acceptance criteria

- [ ] `generateMetadata` produces per-page title, description, OG image from Page SEO
- [ ] Pages without explicit SEO fall back to Site Settings defaults
- [ ] `sitemap.xml` generated statically listing all pages × all locales
- [ ] `robots.txt` in `public/` allowing all crawlers
- [ ] Canonical URLs generated per page via `generateMetadata`
- [ ] hreflang tags generated for all locale variants of each page
- [ ] Root `/` redirects to default locale
- [ ] URL-prefixed locales including default (`/en/`, `/el/`, `/de/`)
- [ ] Locale-aware navigation and alternate link helpers available
- [ ] Single-locale configuration works without i18n overhead
- [ ] `pnpm build` succeeds — all SEO assets present in `out/`
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `06-navigation-footer` — needs Site Settings data flowing through layout for SEO defaults
- `07-hero-features-slices` — needs page rendering pipeline for `generateMetadata`
