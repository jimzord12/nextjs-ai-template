Method: chore
Status: ready-for-agent
Complexity: 1
BlockedBy: none

# Static export configuration

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Enable `output: 'export'` in `next.config.ts` to enforce the hard static-export constraint for Tier 1. No server features are allowed: no SSR, no server actions, no API routes, no ISR. Verify the existing bare skeleton builds cleanly under static export and produces an `out/` directory.

This is the foundational gate — every subsequent issue assumes static export is active.

## Acceptance criteria

- [ ] `next.config.ts` contains `output: 'export'`
- [ ] `pnpm build` succeeds and produces an `out/` directory
- [ ] No server-only features remain in the codebase (no `serverActions`, no API routes, no `dynamic = 'force-dynamic'`)
- [ ] Existing `next-intl` i18n routing works under static export (locale pages generate correctly in `out/`)
- [ ] `pnpm typecheck` and `pnpm lint` pass

