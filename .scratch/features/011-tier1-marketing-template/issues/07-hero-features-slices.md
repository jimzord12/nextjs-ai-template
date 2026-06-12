Method: tdd
Status: ready-for-agent
Complexity: 3
BlockedBy: 3, 4, 5

# Hero + Features slice components

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Build the first two composable slice components with full registry integration, establishing the pattern all subsequent slices follow. Both use semantic theme tokens exclusively.

**Hero** — Full implementation (minimal version exists from issue 03, now enhanced). Renders headline, subheadline, background media (image or gradient), optional CTA button. Responsive layout. Uses semantic tokens for all styling.

**Features** — Renders a grid of feature items. Each item has: icon (string identifier or SVG reference), title, description. Responsive grid: 1 column mobile, 2 tablet, 3 desktop. Uses semantic tokens.

Both are registered in the component registry so SliceRenderer can render them. The home page seed content should be updated to include both slices.

This issue also updates the Hero component from issue 03 to use theme tokens instead of raw Tailwind classes.

## Acceptance criteria

- [ ] Hero renders headline, subheadline, background media, optional CTA button
- [ ] Hero responsive across viewports (320px, 768px, 1280px)
- [ ] Features renders a grid of items (icon, title, description)
- [ ] Features grid responsive: 1 col → 2 col → 3 col
- [ ] Both components registered in component registry
- [ ] Both components use semantic theme tokens exclusively
- [ ] Hero updated from raw Tailwind to theme tokens (issue 03遗留)
- [ ] Home page seed JSON updated to include Hero + Features slices
- [ ] Visiting `/en/` renders both slices correctly
- [ ] Component tests for both slices with mock content loader data
- [ ] `pnpm build` succeeds
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `03-slice-renderer-home-page` — needs SliceRenderer and component registry
- `04-theme-token-system` — components must use semantic tokens
- `05-content-model-remaining-schemas` — needs Features slice schema
