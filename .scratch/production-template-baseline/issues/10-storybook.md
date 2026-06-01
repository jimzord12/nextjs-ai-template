Status: ready-for-agent

# Storybook

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Install and configure Storybook for Next.js App Router. Add a `pnpm storybook` script. Create at least one example story for a Hotel Example component (e.g., the room card or hero section from the Homepage slice). Storybook should launch successfully and render the component in isolation.

## Acceptance criteria

- [ ] Storybook installed and configured for Next.js App Router
- [ ] `pnpm storybook` script launches Storybook dev server
- [ ] At least one example story renders a Hotel Example component correctly
- [ ] Storybook can find and render shadcn components
- [ ] `pnpm build-storybook` succeeds (produces a static Storybook build)

## Blocked by

- `06-hotel-homepage` — needs at least one Hotel Example component to create a story for
