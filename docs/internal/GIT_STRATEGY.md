# GitHub Flow Operational Guide

## Core Rules

- **Default Branch:** `main` (must remain clean, stable, and ready to release). Direct pushes are blocked. All merges require a Pull Request (PR).
- **Short-Lived Branches:** No long-lived development branches.
- **Branch Naming Conventions:**
  - `feature/` for new features or layouts
  - `bugfix/` for bug fixes or test failures
  - `chore/` for dependency updates or configuration changes
  - `docs/` for any documentation changes
  - `refactor/` for non-functional code improvements

## Standard Operating Procedure & Local Verification

Before pushing any PR, sync and validate your changes locally:

1. **Sync Local Environment:**
   ```bash
   git checkout main && git pull origin main
   git checkout -b <prefix>/<branch-name>
   ```
2. **Commit Logically:** Write focused, single-responsibility commits.
3. **Run Local Quality Gates:** Run the validation commands specified in [package.json](package.json):
   - **Linter & Formatting:** `pnpm lint`
   - **Type Checking:** `pnpm typecheck`
   - **Unit Tests:** `pnpm test`
   - **Full QA Gate:** `pnpm qa:full`
4. **Isolate Scope:** Do not mix unrelated modifications or global formatting edits into your task branch.

## Pull Request Requirements

To merge into `main`, the branch must pass all repo-level constraints:

- **Repository Gates:**
  - Automated status checks (CI build, typechecks, linter, tests) must pass.
  - At least 1 approved review on the PR.
  - No merge conflicts.
- **PR Description Checklist:**
  - [ ] Concise title and summary of changes.
  - [ ] Motivation/reasoning behind the change.
  - [ ] Link to target issue/ticket (if applicable).
  - [ ] Verification steps (reproducibility or manual testing outcome).

## High-Risk Patterns (Pitfalls)

- **Long-lived branches (>1 week):** Increases convergence complexity and merge conflicts. Resolve by splitting tasks or using feature flags.
- **Oversized PRs (>400 lines or >10 files):** Slows review cycles. Split into smaller independent vertical slices.
- **Branch Cleanup:** Delete merged branches immediately after merge to prevent repository clutter.
