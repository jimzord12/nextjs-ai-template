# CMS Adapter Interface

**Type**: horizontal
**Phase**: 1
**Dependencies**: none

## Scope

The contract types and interfaces that every CMS adapter implements. Defines the normalized data shapes the rest of the template consumes.

Includes:
- `CMSAdapter` interface with `getPageBySlug(locale, slug)` and `getGlobalData(locale)` methods
- `PageModel` — the normalized page shape (metadata, slices array)
- `SliceModel` — a discriminated union of slice data shapes with a `sliceType` discriminator
- `GlobalDataModel` — site-wide data (navigation, footer, site settings)
- `MediaModel` — normalized media reference (alt, dimensions, src, caption)
- `SEOModel` — SEO fields (title, description, ogImage, canonical)
- Local CMS adapter class skeleton implementing the interface (reads from local JSON via content loaders)

All types live in `src/content/types.ts` or a dedicated types directory. The adapter interface is CMS-agnostic — no provider-specific types leak through.

## Acceptance Criteria

- [ ] `CMSAdapter` interface is defined with `getPageBySlug` and `getGlobalData` methods
- [ ] `PageModel`, `SliceModel`, `GlobalDataModel`, `MediaModel`, `SEOModel` types are exported
- [ ] Slice data uses a discriminated union on `sliceType` for type-safe rendering
- [ ] Local CMS adapter class implements the interface (may delegate to content loaders not yet built)
- [ ] Adapter is wired into the app via a factory or config (swappable without code changes)
- [ ] Types compile cleanly under TypeScript strict mode

## Out of Scope

- External CMS adapters (Sanity, Payload — M3)
- Zod schemas for content validation (see `content-model-schemas` feature)
- Content loader implementations (see `content-loaders` feature)
- Slice component rendering (see `slice-renderer` feature)
- Draft/preview mode support

## Notes

This feature establishes the vocabulary the entire CMS layer depends on. Getting the types right here is critical — all downstream features consume these interfaces. The Local CMS adapter can start as a skeleton that throws "not implemented" for methods that need content loaders.
