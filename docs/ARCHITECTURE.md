# Architecture Guide

Based on [Reusable Architecture for Large Next.js Applications](https://www.freecodecamp.org/news/reusable-architecture-for-large-nextjs-applications/).

## The Core Problem

Without intentional architecture, files become coupled — a component reaches into a global store, a page imports a utility from three directories away, auth logic spreads across `/lib`, `/helpers`, and `/utils`. Layered architecture gives everything a place and makes those places mean something.

## Project Baseline Constraints

- **V1 scope:** Vercel-first and static-export-compatible. The current config uses a standard Next.js production build; no ISR, no server functions, and no dynamic API routes in the baseline. Architectural choices should stay compatible with static export if it is enabled later.
- **Marketing-only:** Only the `(marketing)` route group exists in v1. An `(app)` route group for authenticated pages is a v2 consideration — do not assume it.
- **Internationalization** uses `next-intl` on the App Router, compatible with Next.js 16. All locales (en, el, de) are URL-prefixed including the default.
- **Content** follows a **Local CMS** model (Strapi-inspired JSON layer), not loose ad hoc fixture objects. Collection Types, Single Types, Content Components, and Media Records have a predictable on-disk shape.
- **Image rendering** uses `next/image` with a **static-safe approach** compatible with export mode and the local media library.

---

## Layer 1 — App Router & Colocation

The App Router's file-system routing lets you colocate everything related to a route **inside** that route's folder.

```
src/app/
  dashboard/
    page.tsx            # Route entry point
    layout.tsx          # Route-specific shell
    loading.tsx         # Streaming loading state
    error.tsx           # Error boundary
    components/         # Components used ONLY by this route
    lib/                # Data fetching, transforms for this route only
```

**Key insight:** `StatsCard.tsx` and `queries.ts` don't belong to the whole app — they belong to `/dashboard`. Delete the dashboard → delete one folder. Nothing else breaks.

### Rule of Proximity

> A file should live as close as possible to where it's used.

- Used in **one route** → lives in that route's folder
- Used by **two sibling routes** → move up one level
- Used **across the entire app** → shared layer

### Route Groups

Folders wrapped in `()` create route groups — shared layouts without URL segments:

```
src/app/
  [locale]/                 # i18n locale segment (en, el, de)
    (marketing)/            # Public pages (v1 scope — only route group)
      layout.tsx            # Marketing shell (header, footer)
      page.tsx              # Homepage
      rooms/[slug]/...      # Example: room detail pages
      contact/...           # Example: contact page
```

---

## Layer 2 — Feature-Based Folder Structure

Colocation handles routes. But cross-cutting concerns (auth, billing, notifications) don't belong to any single route. Feature-based structure groups files by **domain**, not by **file type**.

```
src/
  features/
    auth/
      components/       # LoginForm, AuthGuard
      hooks/            # useAuth, useSession
      lib/              # tokenStorage, validators
      types.ts
      index.ts          # Barrel export — public API
    rooms/
      components/
      hooks/
      lib/
      types.ts
      index.ts
  shared/
    lib/                # cn() helper, date formatters
    hooks/              # useDebounce, useMediaQuery
```

### Barrel Exports (index.ts) — Not Optional

The `index.ts` defines the feature's **public API**:

```ts
// features/auth/index.ts
export { LoginForm } from "./components/LoginForm";
export { useAuth } from "./hooks/useAuth";
export type { AuthUser } from "./types";

// NOT exported — internal: tokenStorage.ts, validators.ts
```

Rest of app imports from `@/features/auth`, **never** from `@/features/auth/lib/tokenStorage`. Refactor internals → nothing outside the feature breaks.

### Shared vs. Feature

| Shared (`src/shared/`)         | Feature (`src/features/`)   |
| ------------------------------ | --------------------------- |
| `cn()` helper, date formatters | Auth logic, booking flows   |
| Generic hooks (useDebounce)    | Domain hooks (useAuth)      |
| shadcn/ui components           | Feature-specific components |

**Rule:** `shared/` has zero knowledge of any feature. Features import from `shared/`. `shared/` never imports from a feature.

---

## Layer 3 — Local CMS

This template's canonical content source is a **repo-local JSON CMS layer** (the Local CMS) inspired by Strapi, not arbitrary fixture objects spread across `src/lib/`.

```
src/
  content/
    collection-types/     # Repeated content entities (e.g. articles, rooms)
    single-types/         # Singleton documents (e.g. site settings, homepage)
    components/           # Reusable JSON content fragments
    media/
      files/              # Local media assets tracked in the repo
      records/            # Media metadata: alt, dimensions, captions, focal point
```

Pages and features consume this content through typed **Content Loaders** — functions that read JSON, validate through Zod, and return typed objects. Content Loaders are the API contract between content and the rest of the application.

---

## Current Skeleton State

The template ships as a bare skeleton. The current `src/` tree after a fresh clone (or after running Reset):

```
src/
├── app/                          # Layer 1: App Router
│   ├── layout.tsx                # Root layout (passes children through)
│   ├── globals.css               # Design tokens + shadcn base-nova theme
│   ├── not-found.tsx             # 404 page (root-level, locale-independent)
│   ├── favicon.ico
│   └── [locale]/                 # i18n locale segment
│       ├── layout.tsx            # Locale layout (fonts, metadata, IntlErrorHandlingProvider)
│       └── page.tsx              # Skeleton page (centered "Welcome." heading)
│
├── components/                   # App-level components
│   ├── ui/                       # shadcn/ui design system (Button, ButtonVariants)
│   └── providers/                # IntlErrorHandlingProvider
│
├── features/                     # Layer 2: Feature Modules (empty — populated by Hotel Example)
│
├── content/                      # Layer 3: Local CMS
│   ├── collection-types/         # (empty — populated by Hotel Example)
│   ├── single-types/             # (empty — populated by Hotel Example)
│   ├── components/               # (empty — populated by Hotel Example)
│   └── media/
│       ├── files/
│       └── records/
│
├── shared/                       # Cross-cutting shared utilities
│   ├── hooks/                    # (empty — .gitkeep only)
│   └── lib/                      # cn() helper, utils
│
├── i18n/                         # Internationalization
│   ├── routing.ts                # Locale definitions (en, el, de)
│   └── request.ts                # Message loading + error handling
│
├── messages/                     # Translation files
│   ├── en.json
│   ├── el.json
│   └── de.json
│
├── test/                         # Test setup
│   ├── setup.ts                  # @testing-library/jest-dom/vitest
│   ├── button.test.tsx           # Smoke test for shadcn Button
│   └── fixtures/
│
├── env.ts                        # Zod-validated environment variables
└── proxy.ts                      # Middleware (next-intl locale routing)
```

---

## Hotel Example

The template ships with a Hotel Example — a complete demo site for a fictional hotel that demonstrates the full Local CMS pattern. The Hotel Example includes:

- `(marketing)/` route group with homepage, room detail, and contact pages
- `src/components/layout/` (Header, Footer)
- `src/components/shared/` (shared example components)
- `src/features/contact/` (contact form feature)
- Collection Types: `rooms`, `reviews` (with per-locale data and Zod schemas)
- Single Types: `homepage`, `site-settings` (with per-locale data and Zod schemas)
- Media Records with structured metadata
- Content Loaders (`src/content/loaders.ts`)
- E2E tests: `homepage.spec.ts`, `rooms.spec.ts`, `navigation.spec.ts`, `contact.spec.ts`
- `robots.ts` and `sitemap.ts` for SEO

### Hotel Example Tree (reference)

```
src/
├── app/
│   ├── robots.ts                         # SEO
│   ├── sitemap.ts                        # SEO
│   └── [locale]/
│       └── (marketing)/
│           ├── layout.tsx                # Header + Footer shell
│           ├── page.tsx                  # Homepage
│           ├── rooms/[slug]/             # Room detail
│           └── contact/                  # Contact form
│
├── features/
│   └── contact/                          # Contact form feature
│
├── content/
│   ├── collection-types/
│   │   ├── rooms/                        # Per-locale data + schema.ts
│   │   └── reviews/                      # Per-locale data + schema.ts
│   ├── single-types/
│   │   ├── homepage/                     # Per-locale data + schema.ts
│   │   └── site-settings/               # Per-locale data + schema.ts
│   ├── components/                       # Content Components
│   ├── loaders.ts                        # Content Loaders
│   ├── types.ts                          # Shared content types
│   ├── schemas/                          # Reusable Zod schemas
│   └── media/
│       ├── files/                        # Image assets
│       └── records/                      # Structured media metadata
│
├── components/
│   ├── ui/                               # shadcn/ui
│   ├── layout/                           # Header, Footer (stripped by Reset)
│   ├── shared/                           # Shared demo components (stripped by Reset)
│   └── providers/
```

### Reset

Running `scripts/reset-example.sh` strips all Hotel Example content and returns the project to the skeleton state. The reset script is idempotent — safe to run multiple times. See the reset script for the full list of removed and preserved files.

---

## Dependency Flow

```
Route page   → imports from features/ or Content Loaders
Feature      → imports from shared/ and Content Loaders
Content JSON → validated by Zod schemas → consumed by Content Loaders
Shared       → imports nothing (leaf node)
```

Dependencies flow **inward only**. A route knows about features. A feature knows about shared. Shared knows about nothing.
