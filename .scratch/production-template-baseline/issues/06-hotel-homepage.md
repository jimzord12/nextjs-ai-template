Status: done
Method: scaffold
Complexity: 3

# Hotel Homepage (Single Types + Media + Components)

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Build the Hotel Homepage — the first page that consumes the Local CMS end-to-end. Populate Homepage Single Type content and Site Settings Single Type content as JSON records for all three locales. Populate Media Records and add example media files (hotel images). Build shared components (Hero Section, CTA Section, Featured Rooms section) that render from Content Loader output. The Homepage page consumes the `getHomepage(locale)` and `getSiteSettings(locale)` loaders, renders hero, featured rooms, and CTA sections, generates metadata from the SEO Content Component, and renders images using Media Record metadata with Vercel's built-in optimizer.

This is a vertical tracer bullet: JSON content → Zod-validated loader → React component → page → metadata → image rendering → tests.

## Acceptance criteria

- [x] Homepage Single Type content populated for `en`, `el`, `de` locales
- [x] Site Settings Single Type content populated for `en`, `el`, `de` locales
- [x] Media Records created for homepage images (hero background, featured room images) with localized alt/caption
- [x] Example media files placed in `src/content/media/files/`
- [x] Hero Section component renders headline, subheadline, background image, CTA
- [x] CTA Section component renders headline, body, button
- [x] Featured Rooms section renders room cards (using Room Collection Type data via loader)
- [x] Homepage page at `/en`, `/el`, `/de` renders all sections from Content Loader output
- [x] `generateMetadata` produces correct title, description, open graph, twitter cards from SEO Content Component
- [x] Images render using `next/image` with Media Record metadata (width, height, alt)
- [x] Component tests verify sections render correctly given mock loader output
- [x] `pnpm test` passes
- [x] `next build` succeeds and produces static pages for all locales

## Blocked by

- `04-local-cms-foundation` — needs schemas, loaders, and content directory structure
