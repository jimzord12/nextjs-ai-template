# Conventions
## Version Pinning

Critical dependencies — Next.js, React, React DOM, TypeScript, Tailwind CSS, and `@tailwindcss/postcss` — are pinned to exact versions in `package.json`. Transitive copies of React and TypeScript are forced to the same version via `pnpm.overrides`.

**Why exact pins:** This template is a starting point agencies copy into client projects. A caret-range upgrade mid-project can silently break builds or change rendering behaviour. Exact pins guarantee that `pnpm install` today produces the same result as `pnpm install` six months from now.

**When to relax:** Pinning trades freshness for stability. Relax a pin when you intentionally want to adopt a new major or minor version. Run `pnpm update <pkg>` after changing the version string, then run the full test suite before committing.

**Security auditing:** `pnpm audit:ci` runs `pnpm audit --audit-level high` and exits non-zero if critical or high-severity CVEs are found. This is the CI gate — it does not block `pnpm install` locally, but it will fail the pipeline. Resolve CVEs by updating the affected package to a patched version (which may require relaxing a pin).

## Purpose

- Preserve context that would otherwise be lost between work sessions.
- Make decisions and trade-offs traceable.
- Help future contributors understand not only what changed, but why.
