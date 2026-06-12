# Architecture Guide

Based on [Reusable Architecture for Large Next.js Applications](https://www.freecodecamp.org/news/reusable-architecture-for-large-nextjs-applications/).

## The Core Problem

Without intentional architecture, files become coupled — a component reaches into a global store, a page imports a utility from three directories away, auth logic spreads across `/lib`, `/helpers`, and `/utils`. Layered architecture gives everything a place and makes those places mean something.

## Project Baseline Constraints

- **Tier 1 scope:** Static export only (`output: 'export'`). No ISR, no server functions, no dynamic API routes. Deployment target is Vercel (or any static host).
- **Marketing-only:** Only the `(marketing)` route group exists. No authenticated `(app)` route group.
- **Internationalization** uses `next-intl` on the App Router, compatible with Next.js 16. All locales (en, el, de) are URL-prefixed including the default. Single-language sites configure one locale.
- **Content** follows a **Local CMS** model (Strapi-inspired JSON layer), not loose ad hoc fixture objects. Collection Types, Single Types, Content Components, and Media Records have a predictable on-disk shape.
- **Image rendering** uses `next/image` with a **static-safe approach** compatible with export mode and the local media library.
- **Tier 2** (Sanity, server runtime, blog, CI, analytics) is a separate fork — built when the first Tier 2 client appears.
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
    (marketing)/            # Public pages
      layout.tsx            # Marketing shell (header, footer)
      page.tsx              # Homepage
      about/                # Optional: about page
        page.tsx
      contact/              # Contact (third-party form)
        page.tsx
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
├── features/                     # Layer 2: Feature Modules (empty — populated per project)
│
├── content/                      # Layer 3: Local CMS
│   ├── collection-types/         # (empty — populated per project)
│   ├── single-types/             # (empty — populated per project)
│   ├── components/               # (empty — populated per project)
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


## Dependency Flow

```
Route page   → imports from features/ or Content Loaders
Feature      → imports from shared/ and Content Loaders
Content JSON → validated by Zod schemas → consumed by Content Loaders
Shared       → imports nothing (leaf node)
```

Dependencies flow **inward only**. A route knows about features. A feature knows about shared. Shared knows about nothing.
