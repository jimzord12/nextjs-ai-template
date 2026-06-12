Method: tdd
Status: ready-for-agent
Complexity: 2
BlockedBy: 5, 7

# Testimonials + FAQ slice components

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Build the Testimonials and FAQ slice components, following the same pattern established by Hero and Features in issue 07.

**Testimonials** — Iterates over Testimonials Collection Type records and renders client quotes. Each testimonial shows: quote text, author name, role/company, optional avatar. Layout: card grid or carousel-like horizontal scroll. Uses semantic theme tokens.

**FAQ** — Renders expandable question-answer pairs. Each item has a question (clickable to expand/collapse) and an answer. Accessible: proper ARIA attributes, keyboard navigation (Enter/Space to toggle). Uses semantic theme tokens.

Both are registered in the component registry. Seed content updated to include both slices on the home page.

## Acceptance criteria

- [ ] Testimonials iterates Collection Type records and renders quotes
- [ ] Each testimonial shows: quote, author, role/company, optional avatar
- [ ] Testimonials layout responsive across viewports
- [ ] FAQ renders expandable question-answer pairs
- [ ] FAQ items accessible: ARIA attributes, keyboard toggle (Enter/Space)
- [ ] Both components registered in component registry
- [ ] Both components use semantic theme tokens exclusively
- [ ] Home page seed JSON updated to include all 4 slices (Hero, Features, Testimonials, FAQ)
- [ ] Component tests with mock content loader data
- [ ] `pnpm build` succeeds
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `05-content-model-remaining-schemas` — needs Testimonials and FAQ slice schemas, Testimonials Collection Type
- `07-hero-features-slices` — follows the established slice component pattern
