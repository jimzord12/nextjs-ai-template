Method: chore
Status: done
Complexity: 2
BlockedBy: none

# Rename `issues-manager-cli` to `features-cli`

## Parent

PRD: `.scratch/features/010-project-state-tracking/PRD.md`

## What to build

Mechanical rename of the CLI tool across the entire codebase. No logic changes — pure find-and-replace. The rename is a precursor so that all subsequent work uses the new name.

Changes required:

1. Rename directory: `scripts/issues-manager-cli/` → `scripts/features-cli/`
2. Rename spec file: `issues-manager-cli.md` → `features-cli.md`
3. Update `package.json` script: key stays `issues-manager` but value points to `scripts/features-cli/bin.ts`. Also consider renaming the script key to `features-cli`.
4. Update all skill file references (`do-issue/SKILL.md`, `do-issue/METHODS.md`, `to-issues/SKILL.md`, `to-prd/SKILL.md`, `grill-with-docs/SKILL.md`, `milestone-to-briefs/SKILL.md`) — replace `pnpm issues-manager` with `pnpm features-cli` and update any prose referencing "issues-manager-cli" to "features-cli".
5. Update `AGENTS.md` — replace references.
6. Update `.scratch/AGENTS.md` if it references the old name.
7. Update test file descriptions/import paths inside the renamed directory.
8. Run `pnpm test` to confirm everything passes.

## Acceptance criteria

- [x] `scripts/features-cli/` exists with all `.ts` files (no `scripts/issues-manager-cli/` remains)
- [x] `features-cli.md` exists at repo root (no `issues-manager-cli.md` remains)
- [x] `pnpm features-cli get-feature` works and returns the current feature
- [x] `pnpm features-cli list-issues` works for the active feature
- [x] All skill files reference `features-cli` (no stale `issues-manager` references)
- [x] `AGENTS.md` references `features-cli`
- [x] `pnpm test` passes with zero failures

## Blocked by

None — can start immediately.




