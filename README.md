# Next.js Marketing Template - AI-batteries included

## Core strategy

The promise: “marketing site from content model to publishable slices in the fewest decisions possible.”

This repository is intended to become an opinionated Next.js starter for static websites built with SSG/ISR, a reusable UI foundation, and strong support for AI-agent-driven workflows.

Right now, it is best understood as an opinionated website foundation rather than a finished product. The design system base, route shell, testing setup, and documentation conventions are in place; real site content and production workflows still need to be built.

## What This Codebase Wants To Be

The target state is a template that gives a team a strong default way to build applications without having to reinvent structure, UI primitives, testing, and project process.

The intended end state looks like this:

- A modern Next.js App Router codebase using current React patterns.
- A layered structure with route-level colocation, feature modules, and shared leaf utilities.
- A reusable design-system foundation built from composable primitives instead of one-off components.
- A clear place for product features, shared hooks, app-wide helpers, and route-specific logic.
- A project that is easy to extend into rich marketing and content-heavy website surfaces without drifting into generic app-starter sprawl.
- A repo with built-in engineering discipline: tests, linting, conventions, and decision tracking.

## Current State To Final State

This section shows where the repo is today against the intended final shape.

### Foundation

- [x] Next.js App Router project is set up.
- [x] React 19, TypeScript, Tailwind CSS v4, and Biome are installed.
- [x] Base UI primitives exist under `src/components/ui`.
- [x] Global theme tokens and base styling are defined.
- [x] Marketing route group and shared shell exist.
- [ ] Brand identity, product copy, and real information architecture are implemented.

### Architecture

- [x] Architecture direction is documented in `docs/ARCHITECTURE.md`.
- [x] Route-group structure has started under `src/app`.
- [x] Shared and utility directories exist.
- [ ] Feature modules are implemented as first-class units.
- [ ] Barrel-exported feature public APIs are enforced.
- [ ] Dependency boundaries are validated in practice across the codebase.

### Website Surface

- [x] Homepage placeholder exists.
- [x] Header, not-found page, and error boundary exist.
- [ ] Real landing-page sections are implemented.
- [ ] Real multi-section website experience is implemented end-to-end.
- [ ] At least one content detail route demonstrates SSG/ISR patterns cleanly.
- [ ] Site-level metadata, sitemap, robots, and sharing metadata are integrated.

### Quality

- [x] Vitest is configured.
- [x] Testing Library setup exists.
- [x] At least one component smoke test exists.
- [ ] Core UI primitives have meaningful test coverage.
- [ ] Route-level and feature-level tests exist.
- [ ] End-to-end coverage validates key user journeys.

### Project Process

- [x] Project conventions are documented.
- [x] Documentation maintenance rules are documented.
- [x] README reflects the intended product direction and current setup.
- [ ] Contributor onboarding is complete enough for a new engineer to ship a feature without tribal knowledge.

## What Exists Today

The current repo already includes a useful base layer:

- Root layout and global styles.
- A marketing layout with a responsive header.
- Error and not-found handling for the public route group.
- Reusable UI building blocks such as buttons, cards, dialogs, inputs, sheets, and related primitives.
- A `cn()` utility for class composition.
- Unit-test tooling with Vitest and Testing Library.
- Project documentation covering conventions, routines, and architectural direction.

## Proposed Shape

The architecture docs point toward this model:

```text
src/
	app/        # routes, layouts, route-local components and logic
	features/   # domain modules with public APIs
	shared/     # generic hooks, helpers, and reusable cross-cutting pieces
	components/ # design system and higher-level shared UI
	lib/        # app-wide low-level helpers
	test/       # test setup and helpers
```

The intended dependency flow is:

```text
route -> feature -> shared
```

That structure is documented and partially scaffolded, but not yet fully realized in code.

## Stack

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Biome
- Vitest
- Testing Library
- Base UI primitives
- class-variance-authority
- lucide-react

## Getting Started

This repository uses `pnpm`.

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Run the linter:

```bash
pnpm lint
```

Run the test suite:

```bash
pnpm test
```

Build for production:

```bash
pnpm build
```

## Working Rules

This repo is intentionally process-aware. Before making substantial changes, read:

- `docs/WORKING_WITH_ME.md`
- `docs/CONVENTIONS.md`
- `docs/ROUTINES.md`
- `docs/RULES.md`

Those files define the expected engineering behavior and documentation maintenance rules used in this project.

## Near-Term Priority

The highest-leverage next step is to turn the current shell into one real website slice: a branded landing page plus one content detail route that exercises the intended SSG/ISR architecture instead of leaving it purely documented.
