Status: ready-for-agent

# CI Pipeline

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Create a GitHub Actions CI pipeline that runs on every pull request. The pipeline runs lint (`pnpm lint`), tests (`pnpm test`), build (`pnpm build`), and audit (`pnpm audit:ci`) as separate jobs or steps. The pipeline fails on any non-zero exit code. This is the backbone that all QA gates will extend.

## Acceptance criteria

- [ ] `.github/workflows/ci.yml` exists and triggers on PRs
- [ ] Pipeline runs `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm audit:ci`
- [ ] Pipeline fails on any non-zero exit code from any step
- [ ] Pipeline uses the correct Node.js and pnpm versions matching the project
- [ ] Pipeline caches `node_modules` or uses pnpm store cache for performance

## Blocked by

- `02-version-pinning-audit` — needs `pnpm audit:ci` script to exist
