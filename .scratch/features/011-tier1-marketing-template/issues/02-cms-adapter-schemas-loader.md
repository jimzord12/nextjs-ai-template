Method: tdd
Status: ready-for-agent
Complexity: 3
BlockedBy: 1

# CMS adapter interface + content model schemas + LocalCmsAdapter

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Define the CMS adapter contract and implement the local JSON adapter with Zod-validated content loaders. This is the data foundation — every rendering component will consume data through this interface.

**CMS Adapter Interface** — A `CmsAdapter` interface with two methods:
- `getPage(slug, locale)` → returns `PageModel` or throws
- `getGlobalSettings(locale)` → returns typed global settings (stub for now, full implementation in issue 05)

**Page Content Model** — Pages are a Collection Type identified by slug. Each Page record contains: `slug`, `seo` (title, description, ogImage?, noindex?), and an ordered `slices` array. Each slice is a discriminated union `{ type: string, data: unknown }`. For this issue, define only the Hero slice schema as the first slice type — remaining schemas come in issue 05.

**LocalCmsAdapter** — Reads JSON files from `src/content/` through Zod-validated Content Loaders. Content Loaders are the sole interface between CMS data and the application — no component or route ever imports a JSON file directly. One JSON file per locale per record. Missing locale files produce explicit errors (not silent fallback).

**Seed content** — Create a minimal `home` page JSON file for the default locale with one Hero slice containing placeholder text.

**Tests (Vitest)** — Highest-value test seam (S3 from PRD). For each Content Loader: valid JSON → typed output matching schema; invalid JSON → Zod error with descriptive message; missing locale file → explicit error; missing slug → not-found result.

## Acceptance criteria

- [ ] `CmsAdapter` interface defined with `getPage(slug, locale)` and `getGlobalSettings(locale)` (stub)
- [ ] Page Zod schema with slug, seo, and slices discriminated union (Hero type only for now)
- [ ] Hero slice Zod schema: headline, subheadline, backgroundMedia?, ctaButton?
- [ ] Content Loaders read JSON files, parse through Zod, return typed objects
- [ ] `LocalCmsAdapter` implements `CmsAdapter` using Content Loaders
- [ ] Seed `home` page JSON exists for default locale with one Hero slice
- [ ] No direct JSON imports anywhere — all data flows through Content Loaders
- [ ] Missing locale file → explicit error (no silent fallback to default locale)
- [ ] Invalid JSON → Zod error with field-level diagnostic message
- [ ] All Content Loader tests pass (valid, invalid, missing locale, missing slug)
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `01-static-export-configuration` — static export must be active before building content infrastructure
