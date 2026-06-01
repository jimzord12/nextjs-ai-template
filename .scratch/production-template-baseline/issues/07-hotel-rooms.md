Status: ready-for-agent

# Hotel Rooms (Collection Types + Dynamic Routes)

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Build the Room listing page and Room detail page — the second vertical tracer bullet through the Local CMS. Populate Room Collection Type records for all three locales with localized slugs (e.g., `deluxe-suite` in English, localized equivalent in Greek and German). Populate Review Collection Type records. Build room card, amenity list, and gallery components. The Room listing page iterates all rooms via `getAllRooms(locale)`. The Room detail page uses `generateStaticParams` to produce static pages for all room slugs across all locales, renders room details, amenities, gallery, and reviews via `getRoom(slug, locale)`. Generates metadata from SEO Content Component.

This is independent of the Homepage slice (S4) — they consume different content types and can be built in parallel.

## Acceptance criteria

- [ ] Room Collection Type records populated for `en`, `el`, `de` locales (at least 3 rooms)
- [ ] Each room has localized slugs (different per locale where appropriate)
- [ ] Review Collection Type records populated for at least some rooms
- [ ] Room card component renders title, price, featured image, short description
- [ ] Amenity list component renders amenity names with icons
- [ ] Gallery component renders room images from Media Record relations
- [ ] Room listing page at `/en/rooms`, `/el/rooms`, `/de/rooms` renders all rooms
- [ ] Room detail page at `/en/rooms/deluxe-suite` (and localized equivalents) renders full room details
- [ ] `generateStaticParams` produces paths for all room slugs across all locales
- [ ] `generateMetadata` produces correct metadata from SEO Content Component per room
- [ ] Navigating from listing to detail works in all locales
- [ ] 404 renders for non-existent room slugs
- [ ] Component tests verify room card and detail rendering given mock loader output
- [ ] `pnpm test` passes
- [ ] `next build` succeeds and produces static pages for all rooms × all locales

## Blocked by

- `04-local-cms-foundation` — needs schemas, loaders, and content directory structure
