Status: ready-for-agent

# Local CMS Foundation (Schemas + Loaders + Tests)

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Create the full Local CMS infrastructure: content directory structure, Zod schemas for all content types, Content Loader functions, and the Media Record model. This is the "foundation" slice — no pages consume the CMS yet, but all schemas, loaders, and tests are in place and verified.

**Content directory structure** under `src/content/`: `collection-types/`, `single-types/`, `media/files/`, `media/records/`. Each content type directory contains its Zod schema alongside the locale subdirectories.

**Zod schemas** for: Rooms (title, slug, description, price, amenities Content Component, gallery media relations, featured image, availability, SEO Content Component), Reviews (author, rating, body, room relation, date, locale), Homepage (hero Content Component, featured rooms relations, CTA Content Component, SEO Content Component), Site Settings (site name, default SEO fallback, contact info, social links, logo media relation). Content Components (SEO, Amenities, Hero Section, CTA Section, Rich Text Block) are defined as reusable schema fragments that compose into the type schemas. Media Record schema: id, alt (per locale), width, height, caption (per locale), focalPoint, file reference.

**Content Loaders**: typed async functions that read a JSON file from the content directory, parse it through the corresponding Zod schema, and return a typed object. Each loader accepts slug and locale. Loaders are the sole interface between the CMS and the application — no direct JSON imports anywhere. Also implement listing loaders (e.g., `getAllRooms(locale)`) for collection types.

**Content is one JSON file per locale per record.** Collection types: `collection-types/rooms/en/deluxe-suite.json`. Single types: `single-types/homepage/en.json`.

**Tests**: Write Content Loader tests (S3 seam from PRD) — valid JSON produces typed output; invalid JSON produces Zod error; missing locale produces explicit error; missing slug produces not-found result. Create minimal test fixture JSON files for testing.

## Acceptance criteria

- [ ] `src/content/` directory structure created: `collection-types/`, `single-types/`, `media/files/`, `media/records/`
- [ ] Zod schemas defined for Rooms, Reviews, Homepage, Site Settings, and Media Record
- [ ] Content Component schemas defined: SEO, Amenities, Hero Section, CTA Section, Rich Text Block
- [ ] Content Loaders implemented: `getRoom(slug, locale)`, `getAllRooms(locale)`, `getReview(slug, locale)`, `getHomepage(locale)`, `getSiteSettings(locale)`, `getMediaRecord(id)`
- [ ] Each loader reads JSON, validates through Zod, returns typed object
- [ ] Content Component schemas compose into type schemas (not standalone files)
- [ ] Test fixture JSON files exist for at least one content type
- [ ] Content Loader tests pass: valid JSON → typed output, invalid JSON → Zod error, missing locale → explicit error, missing slug → not-found
- [ ] `pnpm test` passes
- [ ] `next build` succeeds (schemas loaded but no pages consume them yet)
- [ ] No direct JSON imports exist — all content access goes through loaders

## Blocked by

- `03-i18n-routing-skeleton` — content directory structure must account for locale-aware routing

## Further Notes

This slice delivers no visible pages, but it delivers the entire CMS contract. Subsequent page slices (Homepage, Rooms) will consume these loaders to render content. The test fixtures created here are minimal — real content records are populated in those page slices.
