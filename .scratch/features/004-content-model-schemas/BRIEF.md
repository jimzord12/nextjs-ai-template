# Content Model Schemas

**Type**: horizontal
**Phase**: 1
**Dependencies**: none

## Scope

All Zod schemas that define the Local CMS content model. A Strapi-inspired structure with collection types, single types, reusable content components, media records, and SEO fields — all validated at build time.

Includes:
- **SEO fields schema** — title, description, openGraph image, canonical URL, noindex flag
- **Content component schemas** — reusable JSON fragments embedded in types:
  - Hero Section (heading, subheading, CTA, background image)
  - Feature Grid (array of feature items with icon/heading/description)
  - CTA Section (heading, description, button label + link)
  - Testimonials (array of quote/author/role/avatar items)
  - Room Gallery (array of room references with display options)
- **Collection type schemas** — repeatable entities with slugs:
  - Room (name, description, images, amenities, price, availability, SEO fields)
  - Review (author, rating, quote, date, locale-aware)
- **Single type schemas** — one record per locale:
  - Homepage (slices array, SEO fields)
  - Site Settings (site name, navigation links, footer content, social links)
- **Media record schema** — alt text per locale, dimensions, caption, focal point, file reference
- TypeScript type inference from Zod schemas (`z.infer<typeof XSchema>`)

Schemas live in `src/content/schemas/`. Each schema is a separate file matching its domain.

## Acceptance Criteria

- [ ] All content component schemas defined with Zod
- [ ] Collection type schemas (Room, Review) defined with slug + SEO fields
- [ ] Single type schemas (Homepage, SiteSettings) defined with slices array + SEO fields
- [ ] Media record schema defined with locale-aware alt text
- [ ] SEO fields schema is reusable across all content types
- [ ] TypeScript types are inferred from schemas (`z.infer`), not hand-written
- [ ] Invalid JSON content fails with clear Zod error messages
- [ ] Schemas compile cleanly under TypeScript strict mode

## Out of Scope

- Actual JSON content data files (see `hotel-example` feature)
- Content loader functions that use these schemas (see `content-loaders` feature)
- CMS adapter implementation (see `cms-adapter-interface` feature)
- Component rendering (see `slice-renderer` feature)

## Notes

These schemas are the single source of truth for the content model. Both the content loaders and the adapter interface types should derive from them. The content model follows CONTEXT.md vocabulary: "Collection Type", "Single Type", "Content Component", "Media Record".
