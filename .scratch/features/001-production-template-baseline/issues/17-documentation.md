Status: done
Method: chore
Complexity: 3
BlockedBy: 16

# Documentation

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Write and update all project documentation to reflect the actual codebase. This is the final slice because documentation must describe what exists, not what's planned.

**Scaffold baselines audit**: Document what already exists — env validation, root metadata and font loading, design tokens and shadcn base-nova baseline, error/not-found patterns, unit/component testing setup.

**TECH_STACK.md**: Create `docs/TECH_STACK.md` listing every dependency with what it is, why we chose it, and a link to its docs. Clearly distinguish `[installed]` vs `[planned]` entries. Cross-reference `CONVENTIONS.md`.

**README.md**: Replace default Next.js boilerplate with template-specific content: what this is, how to use it, available scripts, the reset workflow, and links to `docs/`. Include reset script usage instructions.

**ARCHITECTURE.md**: Update to reflect actual file structure (SSOT codebase), v1 scope (Vercel-first, marketing-only, no `(app)` group), and the Local CMS layer.

**CONVENTIONS.md**: Add Local CMS conventions, `next-intl` patterns, scaffold baselines, and the established conventions for content loaders, schemas, and media records.

**ROUTINES.md**: Add QA routines — how to run `pnpm qa`, what each `qa:*` script does, how to interpret reports.

**DEPLOYMENT.md**: Create with Vercel as the primary platform for v1. Include `vercel.json` security headers configuration, deployment steps, and a note that other platforms are deferred to v2.

**Partial-removal guide**: Document what a template user should do to opt out of individual tools (e.g., remove Storybook, skip Playwright). Where clean removal isn't feasible, state "manual removal required."

## Acceptance criteria

- [x] `docs/TECH_STACK.md` created with all dependencies listed, `[installed]`/`[planned]` status, rationale, and doc links
- [x] `README.md` updated with template-specific content, available scripts, reset workflow
- [x] `docs/ARCHITECTURE.md` updated to match actual file structure and v1 scope
- [x] `docs/CONVENTIONS.md` updated with Local CMS conventions, i18n patterns, scaffold baselines
- [x] `docs/ROUTINES.md` updated with QA routines
- [x] `docs/DEPLOYMENT.md` created with Vercel deployment guide and security headers
- [x] Scaffold baselines audited and documented (env validation, root metadata, design tokens, error patterns, test setup)
- [x] Partial-removal guide included for individual tool opt-out
- [x] Move `docs/in-progress/Nextjs-Quality-Assurance-Guide.pdf` to `docs/` (no longer in-progress)
- [x] All documentation uses domain vocabulary from `CONTEXT.md`

## Blocked by

- `16-cross-browser-reporting` — documentation must describe the final state including QA routines

## Further Notes

This is marked HITL because it requires reviewing the complete codebase state and making judgment calls about what to document and what to omit. The human should review the final documentation for accuracy and completeness.


