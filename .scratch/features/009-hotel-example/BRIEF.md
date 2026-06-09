# Hotel Example

**Type**: vertical
**Phase**: 4
**Dependencies**: `content-loaders`, `slice-renderer`, `hybrid-routing`, `theme-completion`

## Scope

Full demo content that validates the entire M1 stack end-to-end. A hotel marketing site with rooms, reviews, and full i18n across all 3 locales.

Includes:
- **JSON content data** — complete content files for all 3 locales (en, el, de):
  - Collection types: 3-4 rooms (name, description, amenities, images, price), 6-8 reviews
  - Single types: homepage (with slices: Hero, FeatureGrid, CTA, Testimonials), site settings (navigation links, footer, social)
  - Media records: metadata JSON for all images used
  - Media files: actual image files in `src/content/media/files/`
- **Slice components** — React components for each slice type:
  - Hero — full-width hero with heading, subheading, CTA button, background image
  - Feature Grid — responsive grid of feature cards
  - CTA Section — centered call-to-action band
  - Testimonials — customer testimonial display
  - Room Gallery — room cards linking to detail pages
- **Layout components**:
  - Header — site name, navigation links, locale switcher, dark mode toggle
  - Footer — site info, navigation, social links
- **Room detail pages** — individual room pages rendered via the catch-all route
- **Visual quality** — components use semantic theme tokens, responsive, accessible. Not wireframes.
- **E2E proof** — the site renders on all 3 locales, navigation works, dark mode toggles, rooms are browsable

## Acceptance Criteria

- [ ] Hotel Example renders on all 3 locales (`/en/`, `/el/`, `/de/`) with local JSON content
- [ ] Homepage displays Hero, Feature Grid, CTA, and Testimonials slices
- [ ] Room listing and detail pages render with images and amenities
- [ ] Header navigation links work across locales
- [ ] Footer displays site settings content
- [ ] Locale switcher navigates between `/en/`, `/el/`, `/de/`
- [ ] Dark mode toggle works via `next-themes`
- [ ] All components use semantic theme tokens (no raw Tailwind color values)
- [ ] `pnpm lint`, `pnpm test`, `pnpm build` all pass
- [ ] Reset script strips all Hotel Example content back to skeleton

## Out of Scope

- Contact form slice (M2 — requires TanStack Form)
- Additional marketing components (M2)
- Storybook stories (M2)
- External CMS adapters (M3)
- Performance/SEO/Accessibility QA pipeline (M4)

## Notes

This is the integration proof for all M1 infrastructure. It should feel like a real hotel marketing site — not a wireframe, not a tutorial. The content should be believable (real-ish hotel copy, proper room names, genuine-sounding reviews). Images can use placeholder photos but should be properly sized and optimized. The reset script should still work after this feature — verify by running it.
