Status: done
Method: chore
Complexity: 2
BlockedBy: none

# Version Pinning + Audit Script

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Pin critical dependencies (Next.js, React, TypeScript, Tailwind) to exact versions in `package.json`. Use `pnpm.overrides` for transitive dependency pinning where needed. Add a `pnpm audit:ci` script that runs `pnpm audit` and fails on critical/high CVEs. Document the pinning rationale — why exact versions, what the tradeoff is, when to relax pins — in the appropriate conventions or tech stack documentation location.

## Acceptance criteria

- [x] Next.js, React, React DOM, TypeScript, Tailwind CSS pinned to exact versions in `package.json`
- [x] Overrides added for transitive deps in `pnpm-workspace.yaml` (pnpm 11 syntax)
- [x] `pnpm audit:ci` script exists and fails on critical/high CVEs
- [x] `pnpm audit:ci` exits 0 when no critical/high CVEs found
- [x] Pinning rationale documented in `docs/CONVENTIONS.md`
- [x] `pnpm install` and `pnpm build` succeed after pinning

## Blocked by

None — can start immediately.
