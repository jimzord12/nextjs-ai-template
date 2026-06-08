# Next.js AI Template

A production-grade Next.js static-site template optimized for agencies delivering client marketing sites.

- **Vercel-first baseline** — the default config uses `next build` + `next start`; enable `output: 'export'` if you want a pure static export
- **i18n out of the box** — English, Greek, German with URL-prefixed locales
- **Local CMS model** — Strapi-inspired JSON content with Zod validation
- **Quality gates built in** — Linting, testing, accessibility, performance, and security

> [!NOTE]
> This template ships with a complete **Hotel Example** — a hotel marketing site that demonstrates the architecture in practice. Use it as a reference, then strip it and start building.

---

## Quick Start

```bash
# Clone the template
git clone <repo-url> my-project && cd my-project

# Install dependencies
pnpm install

# Start dev server (http://localhost:3000)
pnpm dev
```

Prerequisites: **Node.js >= 22**, **pnpm >= 11**. No database, no Docker.

---

## Reset the Hotel Example

The template ships with a full hotel demo (pages, content, components, features, E2E tests). Strip it all and get a bare i18n skeleton:

```bash
pnpm run reset
# or: bash scripts/reset-example.sh
```

This removes:
- `(marketing)/` route group and all hotel pages
- Layout components, shared components, contact feature
- All content data files (directories preserved with `.gitkeep`)
- Content loaders, types, schemas, and tests
- Hotel E2E test specs

And creates:
- Skeleton `src/app/[locale]/page.tsx`
- Minimal message files (`en.json`, `el.json`, `de.json`)
- Clean `src/env.ts`

The script is idempotent — safe to run multiple times.

---

## Available Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production Next.js build |
| `pnpm start` | Serve production build locally |
| `pnpm lint` | Biome check (lint + format) |
| `pnpm typecheck` | TypeScript type check (`tsc --noEmit`) |
| `pnpm check` | Lint + typecheck combined |
| `pnpm test` | Vitest unit tests |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:coverage` | Vitest with coverage report |
| `pnpm test:e2e` | Playwright E2E tests |
| `pnpm qa` | Full QA suite (all categories, reports in `.qa/`) |
| `pnpm qa:full` | Full quality gates (build + test + QA) |
| `pnpm qa:performance` | Unlighthouse performance audit |
| `pnpm qa:a11y` | axe-core accessibility scan |
| `pnpm qa:seo` | Lighthouse SEO audit |
| `pnpm qa:cross-browser` | Playwright across Chromium, Firefox, WebKit |
| `pnpm qa:security` | Dependency audit for critical/high CVEs |
| `pnpm qa:bundle` | Bundle size analysis |
| `pnpm qa:doctor` | react-doctor quality gate (threshold: 80) |
| `pnpm audit:ci` | CVE audit gate for CI |
| `pnpm analyze` | Bundle analyzer visualization |
| `pnpm storybook` | Storybook dev server |
| `pnpm build-storybook` | Build Storybook static site |
| `pnpm doctor` | react-doctor local run |
| `pnpm git:prune` | Delete merged local branches |
| `pnpm run reset` | Strip Hotel Example → bare skeleton |

---

## Tech Stack

**Core:** Next.js 16 · React 19 · TypeScript 5.9 · Tailwind CSS 4

**UI:** shadcn (copy-paste components) · Base UI · Lucide icons · Sonner toasts

**Forms:** TanStack Form · Zod validation

**i18n:** next-intl (App Router, URL-prefixed locales)

**Testing:** Vitest · Testing Library · Playwright (E2E, cross-browser, a11y)

**Quality:** Biome (lint + format) · react-doctor · Unlighthouse · Lighthouse

**Git:** Husky · lint-staged · commitlint (Conventional Commits)

**Docs:** Storybook

→ Full dependency details: [docs/TECH_STACK.md](docs/TECH_STACK.md)

---

## Project Structure

```
src/
  app/                    # Next.js App Router routes
    [locale]/             # i18n locale segment
      (marketing)/        # Public pages route group
  components/
    ui/                   # shadcn design system
    providers/            # Theme, intl providers
  features/               # Domain modules (barrel-exported)
  content/                # Local CMS (JSON + Zod)
    collection-types/     # Repeatable content entities
    single-types/         # Singleton documents
    components/           # Reusable content fragments
    media/                # Files + metadata records
  shared/
    lib/                  # cn(), formatters
    hooks/                # Generic hooks
  i18n/                   # Routing + request config
  messages/               # Translation files (en, el, de)
  test/                   # Setup + test helpers
```

→ Full architecture guide: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Documentation

| Document | What it covers |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layered architecture, dependency flow, content model |
| [docs/TECH_STACK.md](docs/TECH_STACK.md) | Every dependency with rationale and links |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel deployment, security headers, partial removal guide |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | Version pinning, PR requirements |
| [docs/ROUTINES.md](docs/ROUTINES.md) | QA routines, git routines, cross-browser checklist |
| [docs/RULES.md](docs/RULES.md) | Agent and contributor rules |
| [docs/WORKING_WITH_ME.md](docs/WORKING_WITH_ME.md) | How to work with this repo |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Setup, branch strategy, scripts, quality gates |

---

## License

Private template. All rights reserved.
