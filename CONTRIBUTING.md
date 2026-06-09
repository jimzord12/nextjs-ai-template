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
- All changes land via **pull request** from **short-lived branches**: `feat/*`, `fix/*`, `chore/*`, `docs/*`.
- No `develop` branch. No release branches.
- **Squash merge** preferred.
- **Merge via `gh` CLI** — squash-merge and delete the remote branch in one command:
  ```bash
  gh pr merge <number> --squash --delete-branch
  ```
  Then pull the result locally:
  ```bash
  git switch main && git pull
  ```
  > **Note:** The `post-checkout` Husky hook automatically runs `git fetch --prune` when you switch to `main`, so stale remote-tracking refs from the just-deleted branch are cleaned up with no extra step.
- **Stale remote refs are pruned automatically** — a Husky `post-checkout` hook runs `git fetch --prune` every time you switch to `main`. This removes ghost remote-tracking refs left behind after squash-merging PRs on GitHub. If you ever need to do it manually: `git fetch --prune`.
- To clean up **local merged branches** in one shot, run `pnpm git:prune`. This also prunes remote refs as a first step.

## PR Requirements

CI must pass before merge. The pipeline runs:

1. `pnpm lint` — Biome check
2. `pnpm typecheck` — TypeScript compile check
3. `pnpm test` — Vitest unit tests
4. `pnpm build` — Next.js production build
5. `pnpm audit:ci` — flags critical/high CVEs

**Before each push**, Husky runs `pnpm ci:local` from the `pre-push` hook. That mirrors the core PR checks locally:

```bash
pnpm install --frozen-lockfile && pnpm check && pnpm test && pnpm build && pnpm audit:ci
```

If any of those checks fail, including a stale `pnpm-lock.yaml`, Git blocks the push.

### CI Bypass Label

Use the `ci-bypass-approved` label only when you intentionally want to skip the expensive PR jobs for a pull request into `main`.

- The PR workflow always runs a lightweight policy job.
- Docs-only and text-only PRs still report `ci-gate`, but skip the expensive jobs automatically.
- When the label is present, the expensive jobs are skipped.
- When the label is removed, the next PR event runs the full workflow again.

### Apply The Bypass In GitHub UI

1. Open the pull request.
2. In the right sidebar, open `Labels`.
3. Add the `ci-bypass-approved` label.
4. Wait for the CI workflow to re-run on the label event.

### Apply The Bypass With `gh`

Create the label once if the repository does not have it yet:

```bash
gh label create ci-bypass-approved --color FFAA00 --description "Approved to skip heavy CI jobs"
```

Add the label to a pull request:

```bash
gh pr edit <pr-number> --add-label ci-bypass-approved
```

Remove the label and restore full CI:

```bash
gh pr edit <pr-number> --remove-label ci-bypass-approved
```

Use the [PR template](.github/PULL_REQUEST_TEMPLATE.md). Fill in What, Why, How, Testing, and the checklist.

## Code Style

Biome owns formatting and linting. Don't argue with it.

- **Check:** `pnpm lint`
- **Fix:** `pnpm lint:fix`
- **Config:** `biome.json` at repo root (2-space indent, 80-char line width, double quotes)

Key conventions:

- Use `type` over `interface` for data shapes.
- Biome runs on pre-commit via Husky + lint-staged.
- Don't disable lint rules project-wide. Fix the code, or suppress inline if truly necessary.

## Available Scripts

| Script                  | What it does                                                         |
| ----------------------- | -------------------------------------------------------------------- |
| `pnpm dev`              | Dev server with Turbopack                                            |
| `pnpm build`            | Production build (`next build`)                                      |
| `pnpm start`            | Serve production build                                               |
| `pnpm ci:local`         | Local pre-push CI mirror: frozen lockfile, check, test, build, audit |
| `pnpm lint`             | Biome check (lint + format)                                          |
| `pnpm lint:fix`         | Biome check with auto-fix                                            |
| `pnpm doctor`           | Run react-doctor locally                                             |
| `pnpm typecheck`        | `tsc --noEmit`                                                       |
| `pnpm check`            | Lint + typecheck combined                                            |
| `pnpm test`             | Vitest unit tests                                                    |
| `pnpm test:watch`       | Vitest in watch mode                                                 |
| `pnpm test:coverage`    | Vitest with coverage report                                          |
| `pnpm test:e2e`         | Playwright E2E tests                                                 |
| `pnpm qa:doctor`        | react-doctor quality gate (threshold: 80)                            |
| `pnpm qa:performance`   | Unlighthouse performance audit                                       |
| `pnpm qa:a11y`          | Accessibility E2E tests (axe-core)                                   |
| `pnpm qa:cross-browser` | Playwright across Chromium, Firefox, WebKit                          |
| `pnpm qa:security`      | Dependency audit (high+ severity)                                    |
| `pnpm qa:seo`           | SEO audit script                                                     |
| `pnpm qa:bundle`        | Bundle analysis with `ANALYZE=true`                                  |
| `pnpm qa`               | Full QA report                                                       |
| `pnpm qa:full`          | All quality gates                                                    |
| `pnpm audit:ci`         | CI dependency audit (critical/high CVEs)                             |
| `pnpm storybook`        | Storybook dev server (port 6006)                                     |
| `pnpm build-storybook`  | Static Storybook build                                               |
| `pnpm doctor`           | react-doctor (alias for qa:doctor)                                   |
| `pnpm fallow`           | Dead code detection                                                  |
| `pnpm fallow:audit`     | Full dead code audit                                                 |
| `pnpm analyze`          | Bundle analysis via `@next/bundle-analyzer`                          |
| `pnpm git:prune`        | Delete locally-merged tracking branches                              |

## Quality Gates

`pnpm qa:doctor` runs [react-doctor](https://react-doctor.dev) against the project. It scores the codebase and exits non-zero below the threshold.

- **Config:** `doctor.config.json` at repo root

The PR CI workflow enforces lint, typecheck, tests, build, and audit by default. If the `ci-bypass-approved` label is present on a PR, the workflow records the bypass in its policy job and skips the expensive jobs for that run.

## Additional Rules

- **No destructive git commands** (`reset --hard`, `push --force`, `clean -fd`, etc.) without explicit permission.
- **Docs index:** When adding or removing files under `docs/`, update `docs/index.md`.
- **No cutting corners:** If something is "done", it works end-to-end. Suppressing errors or disabling rules is not a fix. If you're stuck, say so.
- **Config changes need approval:** Anything touching `.gitignore`, `tsconfig`, `biome.json`, `next.config`, or `package.json` scripts/dependencies — ask first.
