# Architecture Guide

Based on [Reusable Architecture for Large Next.js Applications](https://www.freecodecamp.org/news/reusable-architecture-for-large-nextjs-applications/).

## The Core Problem

Without intentional architecture, files become coupled — a component reaches into a global store, a page imports a utility from three directories away, auth logic spreads across `/lib`, `/helpers`, and `/utils`. Layered architecture gives everything a place and makes those places mean something.

## Project Baseline Constraints

- The starter baseline is **static export only**. Architectural choices in the baseline should stay compatible with `output: 'export'`; ISR is a later variation, not a baseline assumption.
- Internationalization uses `next-intl` on the App Router, and this project treats it as compatible with the Next.js 16 baseline.
- Content follows a **local Strapi-like JSON CMS** model, not loose ad hoc fixture objects. Collection types, single types, reusable components, SEO fields, locale-aware records, and media records should have a predictable on-disk shape.
- Image rendering should use `next/image` with a **static-safe approach** that works in export mode and with the local media library model.

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
    (marketing)/            # Public pages: home, rooms, contact (v1 scope)
      layout.tsx
      page.tsx              # Homepage
      rooms/[slug]/...
      contact/...
    (app)/                  # Authenticated pages (v2 scope — not yet implemented)
      layout.tsx
      dashboard/...
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
    bookings/
      ...
  shared/
    components/         # Generic: Spinner, Modal
    hooks/              # useDebounce, useMediaQuery
    lib/                # http client, date formatters
    ui/                 # shadcn/ui design system
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

## Layer 3 — Local Content System

This starter's canonical content source is a **repo-local JSON CMS layer** inspired by Strapi, not arbitrary fixture objects spread across `src/lib/`.

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

Pages and features should consume this content through typed loaders, adapters, or validation layers rather than importing loose fixture blobs directly. That keeps the starter aligned with the Strapi-like mental model while remaining fully local and export-safe.

---

## An example: Hotel Website Structure

```
src/
├── app/                          # Layer 1: App Router & Colocation
│   ├── layout.tsx                # Root layout (fonts, providers)
│   ├── globals.css
│   └── [locale]/                 # i18n locale segment (en, el, de)
│       ├── (marketing)/          # Public pages route group (v1 scope)
│       │   ├── layout.tsx        # Public layout (header, footer)
│       │   ├── page.tsx          # Homepage
│       │   ├── rooms/
│       │   │   └── [slug]/       # Room detail
│       │   │       ├── components/
│       │   │       └── lib/
│       │   └── contact/
│       └── (app)/                # Authenticated route group (v2 scope — not yet implemented)
│           ├── layout.tsx        # App shell (sidebar, nav)
│           └── dashboard/
│
├── features/                     # Layer 2: Feature Modules
│   └── rooms/                    # Room listings, detail
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── types.ts
│       └── index.ts              # Barrel export
│
├── content/                      # Layer 3: Local Strapi-like JSON CMS
│   ├── collection-types/
│   ├── single-types/
│   ├── components/
│   └── media/
│       ├── files/
│       └── records/
│
├── components/                   # App-level component directories
│   ├── ui/                       # shadcn/ui design system
│   ├── layout/                   # Layout components (Header, Footer)
│   └── shared/                   # Shared example components
│
├── shared/                       # Cross-cutting shared utilities
│   ├── hooks/                    # Generic hooks (useDebounce)
│   └── lib/                      # cn() helper, formatters
│
└── test/                         # Test helpers & setup
```

## Dependency Flow

```
Route page   → imports from features/ or typed content loaders
Feature      → imports from shared/ and validated content adapters
Content JSON → validated before feature or route consumption
Shared       → imports nothing (leaf node)
```

Dependencies flow **inward only**. A route knows about features. A feature knows about shared. Shared knows about nothing.
