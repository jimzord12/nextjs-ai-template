# Contributing

## Prerequisites

- **Node.js** >= 22
- **pnpm** >= 11

No Docker. No database. Clone and go.

## Local Setup

```bash
pnpm install
pnpm dev
```

That's it. The dev server runs on `http://localhost:3000` with Turbopack.

## Branch Strategy

GitHub Flow — nothing else:

- `main` is the only long-lived branch. It's protected.
- All changes land via pull request from short-lived branches: `feat/*`, `fix/*`, `chore/*`, `docs/*`.
- No `develop` branch. No release branches.
- Squash merge preferred.

## PR Requirements

CI must pass before merge. The pipeline runs:

1. `pnpm lint` — Biome check
2. `pnpm test` — Vitest unit tests
3. `pnpm build` — Next.js production build
4. `pnpm audit:ci` — flags critical/high CVEs
5. `pnpm qa:doctor` — react-doctor score >= 80

Use the [PR template](.github/PULL_REQUEST_TEMPLATE.md). Fill in What, Why, How, Testing, and the checklist. Resolve all conversations before merging.

## Code Style

Biome owns formatting and linting. Don't argue with it.

- **Check:** `pnpm lint`
- **Fix:** `pnpm exec biome check --write .`
- **Config:** `biome.json` at repo root (2-space indent, 80-char line width, double quotes)

Key conventions:

- Use `type` over `interface` for data shapes.
- Biome runs on pre-commit via Husky + lint-staged.
- Don't disable lint rules project-wide. Fix the code, or suppress inline if truly necessary.

## Available Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production build (`next build`) |
| `pnpm start` | Serve production build |
| `pnpm lint` | Biome check (lint + format) |
| `pnpm doctor` | Run react-doctor locally |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm check` | Lint + typecheck combined |
| `pnpm test` | Vitest unit tests |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:coverage` | Vitest with coverage report |
| `pnpm test:e2e` | Playwright E2E tests |
| `pnpm qa:doctor` | react-doctor quality gate (threshold: 80) |
| `pnpm audit:ci` | Audit for critical/high CVEs |
| `pnpm qa` | Full QA suite (all categories) |

## Quality Gates

`pnpm qa:doctor` runs [react-doctor](https://react-doctor.dev) against the project. It scores the codebase and exits non-zero below the threshold.

- **Default threshold:** 80 (set in CI via `REACT_DOCTOR_THRESHOLD`)
- **Config:** `doctor.config.json` at repo root

CI enforces this gate. If it fails, fix the reported issues — don't lower the threshold.

## Additional Rules

- **No destructive git commands** (`reset --hard`, `push --force`, `clean -fd`, etc.) without explicit permission.
- **Docs index:** When adding or removing files under `docs/`, update `docs/index.md`.
- **No cutting corners:** If something is "done", it works end-to-end. Suppressing errors or disabling rules is not a fix. If you're stuck, say so.
- **Config changes need approval:** Anything touching `.gitignore`, `tsconfig`, `biome.json`, `next.config`, or `package.json` scripts/dependencies — ask first.
