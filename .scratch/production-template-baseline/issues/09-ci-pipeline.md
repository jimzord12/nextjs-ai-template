Status: done
Method: chore
Complexity: 2

# CI Pipeline

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Create a GitHub Actions CI pipeline that runs on every pull request. The pipeline runs lint (`pnpm lint`), tests (`pnpm test`), build (`pnpm build`), and audit (`pnpm audit:ci`) as separate jobs or steps. The pipeline fails on any non-zero exit code. This is the backbone that all QA gates will extend.

## Acceptance criteria

- [x] `.github/workflows/ci.yml` exists and triggers on PRs
- [x] Pipeline runs `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm audit:ci`
- [x] Pipeline fails on any non-zero exit code from any step
- [x] Pipeline uses the correct Node.js and pnpm versions matching the project
- [x] Pipeline caches `node_modules` or uses pnpm store cache for performance

## Blocked by

- `02-version-pinning-audit` — needs `pnpm audit:ci` script to exist
