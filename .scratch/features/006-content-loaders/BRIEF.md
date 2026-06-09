# Content Loaders

**Type**: horizontal
**Phase**: 2
**Dependencies**: `cms-adapter-interface`, `content-model-schemas`

## Scope

Typed functions that read Local CMS JSON files, validate them through Zod schemas, and return typed objects. The data-access layer the Local CMS adapter delegates to.

Includes:
- **Collection type loaders** — `getRoom(slug, locale)`, `getReview(slug, locale)` that read from `src/content/collection-types/{type}/{slug}.{locale}.json`
- **Single type loaders** — `getHomepage(locale)`, `getSiteSettings(locale)` that read from `src/content/single-types/{type}/{locale}.json`
- **Media helpers** — `getMediaRecord(id, locale)` that reads from `src/content/media/records/{id}.json` and resolves file paths
- **Listing functions** — `getAllRooms(locale)`, `getAllReviews(locale)` that enumerate slugs and return arrays
- **Path conventions** — consistent file naming: `{slug}.{locale}.json` for collections, `{locale}.json` for singles
- **Error handling** — clear error messages for missing files, invalid JSON, schema validation failures
- **Unit tests** — each loader tested with valid and invalid fixtures

Loaders live in `src/content/loaders/` with one file per content type.

## Acceptance Criteria

- [ ] `getRoom(slug, locale)` reads and validates a room JSON file
- [ ] `getReview(slug, locale)` reads and validates a review JSON file
- [ ] `getHomepage(locale)` reads and validates the homepage JSON file
- [ ] `getSiteSettings(locale)` reads and validates site settings JSON file
- [ ] `getMediaRecord(id, locale)` reads media metadata and resolves file references
- [ ] Listing functions enumerate all records of a given type for a locale
- [ ] Invalid content produces clear build-time errors with file path and Zod issues
- [ ] All loaders have unit tests with valid and invalid fixtures
- [ ] TypeScript strict mode passes

## Out of Scope

- External CMS data fetching (M3)
- Slice rendering logic (see `slice-renderer` feature)
- Hybrid routing / page generation (see `hybrid-routing` feature)
- Actual demo content data (see `hotel-example` feature)

## Notes

Loaders are the bridge between the raw JSON content and the typed CMS adapter interface. They're consumed exclusively by the Local CMS adapter — the rest of the app never touches files directly. The reset script already documents the file naming convention; loaders should follow it exactly.
