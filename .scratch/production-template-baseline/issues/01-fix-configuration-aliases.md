Status: done
Method: chore
Complexity: 1

# Fix Configuration Aliases

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Correct the `components.json` aliases to match the actual file structure (SSOT codebase), and update `ARCHITECTURE.md` so its example diagram matches reality. The codebase uses `src/components/ui/` for shadcn components, but `components.json` currently points to `src/shared/components/ui/`. The empty `src/shared/components/ui/` directory (`.gitkeep` only) should be cleaned up. After this fix, running the shadcn CLI (`pnpm dlx shadcn add ...`) should place new components in the correct directory.

Additionally, `ARCHITECTURE.md` shows an example at the bottom with `src/components/ui/` AND `src/shared/` as separate top-level directories, which conflicts with its own Layer 2 section. Reconcile the doc to match the actual SSOT file structure and note that the `(app)` route group is documented but not part of v1 scope.

## Acceptance criteria

- [x] `components.json` aliases point to `src/components/ui/` (not `src/shared/components/ui/`)
- [x] Running `pnpm dlx shadcn add <component>` places the file in `src/components/ui/`
- [x] Empty `src/shared/components/ui/` directory removed
- [x] `ARCHITECTURE.md` example diagram matches the actual file structure
- [x] `ARCHITECTURE.md` notes `(app)` route group as v2 scope
- [x] `next build` succeeds after changes
- [x] All existing imports still resolve correctly

## Blocked by

None — can start immediately.
