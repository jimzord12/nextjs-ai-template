Status: done
Method: chore
Complexity: 2
BlockedBy: 6

# Storybook

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Install and configure Storybook for Next.js App Router. Add a `pnpm storybook` script. Create at least one example story for a Hotel Example component (e.g., the room card or hero section from the Homepage slice). Storybook should launch successfully and render the component in isolation.

## Acceptance criteria

- [x] Storybook installed and configured for Next.js App Router
- [x] `pnpm storybook` script launches Storybook dev server
- [x] At least one example story renders a Hotel Example component correctly
- [x] Storybook can find and render shadcn components
- [x] `pnpm build-storybook` succeeds (produces a static Storybook build)

## Blocked by

- `06-hotel-homepage` — needs at least one Hotel Example component to create a story for
