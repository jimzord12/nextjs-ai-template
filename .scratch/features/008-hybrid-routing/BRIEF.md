# Hybrid Routing

**Type**: horizontal
**Phase**: 3
**Dependencies**: `cms-adapter-interface`, `slice-renderer`

## Scope

Restructure the app routing to support both CMS-driven pages (catch-all) and explicit routes for custom logic. Configure static export mode.

Includes:
- **Route group structure** — create `(marketing)` route group under `[locale]/` per CONTEXT.md:
  ```
  src/app/
    [locale]/
      (marketing)/
        [[...slug]]/
          page.tsx      → CMS-driven catch-all
          loading.tsx   → Suspense fallback
          not-found.tsx → 404 for CMS pages
        layout.tsx      → Marketing layout (header, footer, main)
      layout.tsx        → Locale providers (existing)
    layout.tsx          → Root layout (existing)
    not-found.tsx       → Root 404 (existing)
  ```
- **Catch-all page** — `[[...slug]]/page.tsx` that:
  - Uses the CMS adapter to fetch page data by slug
  - Renders slices via `SliceRenderer`
  - Implements `generateStaticParams` from the adapter
  - Implements `generateMetadata` for SEO from `SEOModel`
- **Static export config** — add `output: 'export'` to `next.config.ts`
- **Marketing layout** — Header + Footer + `<main>` wrapper. Initially minimal structural layout.
- **Root page redirect** — `/` redirects to `/en/` (may already work via middleware)
- **Explicit route pattern** — document how to add custom routes outside the catch-all (e.g., `/contact`)

## Acceptance Criteria

- [ ] `(marketing)` route group with `[[...slug]]` catch-all page exists
- [ ] `generateStaticParams` enumerates all CMS pages at build time
- [ ] `generateMetadata` produces correct SEO metadata from page data
- [ ] `output: 'export'` is set in `next.config.ts`
- [ ] `pnpm build` succeeds and produces a static export
- [ ] Loading and not-found states render correctly
- [ ] Marketing layout provides header/footer/main structure
- [ ] Root `/` redirects to default locale
- [ ] Explicit route pattern is documented for future custom pages

## Out of Scope

- Specific header/footer component implementations (see `hotel-example` feature)
- Navigation data population (see `hotel-example` feature)
- Dynamic server features (ISR, draft mode — post-V1)
- E2E tests for routing (see `hotel-example` feature)

## Notes

This feature moves the app from the post-reset skeleton (`[locale]/page.tsx`) to the production routing structure. The catch-all must handle the root page (slug = `[]` or `['']`) mapping to the homepage. Static export means all pages are pre-rendered at build time — `generateStaticParams` must be exhaustive.
