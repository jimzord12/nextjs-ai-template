# Conventions

This project keeps a process diary.

The diary exists to record what was worked on, why decisions were made, what blockers appeared, and what should happen next. It is part of the project's working conventions, not optional project decoration.

## Diary Convention
- Process records live in `docs/diary/`.
- Each record is a separate Markdown file.
- New diary files should use the format `DIARY-dd-mm-yyyy-xxxxx.md`.
- New entries should start from `docs/templates/DIARY.template.md`.
- Records should capture real implementation thinking, trade-offs, blockers, and follow-up work.

## Version Pinning

Critical dependencies — Next.js, React, React DOM, TypeScript, Tailwind CSS, and `@tailwindcss/postcss` — are pinned to exact versions in `package.json`. Transitive copies of React and TypeScript are forced to the same version via `pnpm.overrides`.

**Why exact pins:** This template is a starting point agencies copy into client projects. A caret-range upgrade mid-project can silently break builds or change rendering behaviour. Exact pins guarantee that `pnpm install` today produces the same result as `pnpm install` six months from now.

**When to relax:** Pinning trades freshness for stability. Relax a pin when you intentionally want to adopt a new major or minor version. Run `pnpm update <pkg>` after changing the version string, then run the full test suite before committing.

**Security auditing:** `pnpm audit:ci` runs `pnpm audit --audit-level high` and exits non-zero if critical or high-severity CVEs are found. This is the CI gate — it does not block `pnpm install` locally, but it will fail the pipeline. Resolve CVEs by updating the affected package to a patched version (which may require relaxing a pin).

## Purpose

- Preserve context that would otherwise be lost between work sessions.
- Make decisions and trade-offs traceable.
- Help future contributors understand not only what changed, but why.
