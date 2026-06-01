Status: done
Method: scaffold
Complexity: 3

# Hotel Rooms (Collection Types + Dynamic Routes)

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Build the Room listing page and Room detail page — the second vertical tracer bullet through the Local CMS. Populate Room Collection Type records for all three locales with localized slugs (e.g., `deluxe-suite` in English, localized equivalent in Greek and German). Populate Review Collection Type records. Build room card, amenity list, and gallery components. The Room listing page iterates all rooms via `getAllRooms(locale)`. The Room detail page uses `generateStaticParams` to produce static pages for all room slugs across all locales, renders room details, amenities, gallery, and reviews via `getRoom(slug, locale)`. Generates metadata from SEO Content Component.

This is independent of the Homepage slice (S4) — they consume different content types and can be built in parallel.

## Acceptance criteria

- [x] Room Collection Type records populated for `en`, `el`, `de` locales (at least 3 rooms)
- [x] Each room has localized slugs (different per locale where appropriate)
- [x] Review Collection Type records populated for at least some rooms
- [x] Room card component renders title, price, featured image, short description
- [x] Amenity list component renders amenity names with icons
- [x] Gallery component renders room images from Media Record relations
- [x] Room listing page at `/en/rooms`, `/el/rooms`, `/de/rooms` renders all rooms
- [x] Room detail page at `/en/rooms/deluxe-suite` (and localized equivalents) renders full room details
- [x] `generateStaticParams` produces paths for all room slugs across all locales
- [x] `generateMetadata` produces correct metadata from SEO Content Component per room
- [x] Navigating from listing to detail works in all locales
- [x] 404 renders for non-existent room slugs
- [x] Component tests verify room card and detail rendering given mock loader output
- [x] `pnpm test` passes
- [x] `next build` succeeds and produces static pages for all rooms × all locales

## Blocked by

- `04-local-cms-foundation` — needs schemas, loaders, and content directory structure
