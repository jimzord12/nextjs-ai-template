Method: tdd
Status: ready-for-agent
Complexity: 3
BlockedBy: 2

# SliceRenderer pipeline + home page renders from JSON

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Build the rendering half of the 4-stage pipeline: Content Loader → PageModel → SliceRenderer. The data layer (adapter + schemas + loaders) is complete from issue 02. This issue wires it into the route so that visiting `/en/` renders a page from JSON content through the full pipeline.

**PageModel** — Normalized shape consumed by routes: `{ slug, seo, slices: Array<{ type, data }> }`. The adapter's `getPage()` returns this shape.

**SliceRenderer** — Iterates the `slices` array, looks up each `type` in a component registry, and renders the corresponding component with validated data. No lazy loading, no per-slice error boundaries — Zod catches bad content at build time.

**Component Registry** — A registry mapping type strings to React components. Adding a new slice is a 2-file operation: Zod schema (done in issue 02) + component + registry entry.

**Hero slice component** — A minimal Hero component that renders headline, subheadline, optional CTA button. Uses raw Tailwind classes for now — theme tokens come in issue 04.

**Route wiring** — The `[locale]/(marketing)/` route calls `cmsAdapter.getPage('home', locale)`, passes the result to `SliceRenderer`, and renders the page. `generateStaticParams` produces params for all locales × all pages.

At the end of this issue, visiting `/en/` renders the "home" page from JSON content. The full pipeline works.

## Acceptance criteria

- [ ] SliceRenderer iterates slices array and renders correct component per type
- [ ] Component registry maps type strings to React components
- [ ] Unknown slice type in registry → clear build-time error (not silent skip)
- [ ] Hero component renders headline, subheadline, optional CTA button
- [ ] Route handler calls `cmsAdapter.getPage('home', locale)` and renders via SliceRenderer
- [ ] `generateStaticParams` produces params for all locales × all pages from content
- [ ] Visiting `/en/` renders the home page with Hero content from JSON
- [ ] All configured locales render the home page (with content or explicit error if JSON missing)
- [ ] `pnpm build` succeeds under `output: 'export'`
- [ ] SliceRenderer component tests pass
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `02-cms-adapter-schemas-loader` — needs adapter interface, schemas, and LocalCmsAdapter to be complete
