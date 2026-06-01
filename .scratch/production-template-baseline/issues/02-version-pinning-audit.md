Status: ready-for-agent

# Version Pinning + Audit Script

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Pin critical dependencies (Next.js, React, TypeScript, Tailwind) to exact versions in `package.json`. Use `pnpm.overrides` for transitive dependency pinning where needed. Add a `pnpm audit:ci` script that runs `pnpm audit` and fails on critical/high CVEs. Document the pinning rationale — why exact versions, what the tradeoff is, when to relax pins — in the appropriate conventions or tech stack documentation location.

## Acceptance criteria

- [ ] Next.js, React, React DOM, TypeScript, Tailwind CSS pinned to exact versions in `package.json`
- [ ] `pnpm.overrides` added for transitive deps where needed
- [ ] `pnpm audit:ci` script exists and fails on critical/high CVEs
- [ ] `pnpm audit:ci` exits 0 when no critical/high CVEs found
- [ ] Pinning rationale documented (location to be determined by implementer — likely `docs/TECH_STACK.md` or `docs/CONVENTIONS.md`)
- [ ] `pnpm install` and `pnpm build` succeed after pinning

## Blocked by

None — can start immediately.
