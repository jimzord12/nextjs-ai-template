# Routines

## QA Routines

Run the full QA suite with:

```bash
pnpm qa
```

This umbrella script runs all QA categories sequentially and collects reports into a `.qa/` directory. It exits non-zero on any failure, making it suitable as a CI gate.

### Individual QA Scripts

| Script                  | What it does                                                                                    | Report output                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `pnpm qa:performance`   | Runs Unlighthouse against the production build and enforces Performance budget ≥ 90             | `.unlighthouse/`                                     |
| `pnpm qa:a11y`          | Runs axe-core accessibility scans against all pages, asserts 0 critical/serious WCAG violations | Playwright HTML report                               |
| `pnpm qa:seo`           | Runs Lighthouse SEO audits against all locale pages, asserts each page meets the current SEO score gate (≥ 80; target 100 after the Hotel Example's SEO work is complete) | `.qa/seo-result-<locale>.report.html`, `.qa/seo-summary.json` |
| `pnpm qa:security`      | Runs `pnpm audit --audit-level high`, exits non-zero on critical/high CVEs                      | Terminal output                                      |
| `pnpm qa:bundle`        | Runs bundle analysis via `@next/bundle-analyzer` (sets `ANALYZE=true`), opens interactive client/bundle size report in browser | Browser (client/server bundle treemaps)              |
| `pnpm qa:cross-browser` | Runs full Playwright suite across Chromium, Firefox, and WebKit                                 | Playwright HTML report                               |
| `pnpm qa:doctor`        | Runs `react-doctor` score check, asserts score meets threshold (default: 80, configurable via `REACT_DOCTOR_THRESHOLD`) | Terminal output                                      |

### Additional Analysis Scripts

| Script          | What it does                                                       |
| --------------- | ------------------------------------------------------------------ |
| `pnpm analyze`  | Alias for `ANALYZE=true pnpm build` — runs `@next/bundle-analyzer` |
| `pnpm doctor`   | Runs `react-doctor` interactively (no threshold enforcement)       |

### Interpreting Reports

After `pnpm qa` completes:

1. Open `.qa/<timestamp>/` for the collected report bundle.
2. Playwright HTML reports are in the `playwright-report/` subdirectory.
3. Unlighthouse report artifacts are in the `unlighthouse-report/` subdirectory.
4. SEO reports are per-locale Lighthouse HTML files in `.qa/`.
5. Each QA category's terminal output is in `<category>.log` files.

## QA Delivery Package

The `.qa/` directory is the QA delivery package — the artifact an Agency screenshots into a Client deck.

### What to capture

For each QA run, the `.qa/<timestamp>/` directory contains:

- **Playwright HTML report** — interactive report showing all E2E test results across browsers
- **Unlighthouse reports** — site-wide performance audits with scores and metrics
- **SEO reports** — per-locale Lighthouse SEO audit HTML files
- **Category logs** — terminal output from each `qa:*` script for audit trails

### How to present

1. Run `pnpm qa` against the production build.
2. Open the Playwright HTML report in a browser and screenshot the summary view.
3. Open the Unlighthouse report and screenshot the score gauges.
4. Open the SEO Lighthouse reports and screenshot the SEO scores.
5. Copy the terminal summary output showing all passes.
6. Compile screenshots into a Client deck with date, project name, and pass/fail status.

### Conventions

- Reports are local HTML files — no hosted dashboards.
- Each QA run creates a timestamped directory (format: `YYYYMMDD-HHMMSS`).
- Old reports are not automatically cleaned up — delete manually or before releases.
- `.qa/` is gitignored and never committed to the repository.

## Git Routines

### Pruning merged local branches

Run `pnpm git:prune` to safely delete all local branches that have been fully merged into `main`.

| Flag        | What it does                                    |
| ----------- | ----------------------------------------------- |
| (none)      | Lists merged branches and asks for confirmation |
| `--dry-run` | Shows what would be deleted without deleting    |

The script always protects `main`, `master`, and the current branch from deletion. It detects both fast-forward merges and GitHub squash merges.

## Manual Cross-Browser Testing Checklist

Automated tests cover Chromium, Firefox, and WebKit via Playwright. The following browsers require manual verification:

### Desktop Browsers

- [ ] **Chrome** (latest) — Layout, interactions, fonts
- [ ] **Safari** (latest) — Layout, interactions, font rendering, scroll behavior
- [ ] **Firefox** (latest) — Layout, interactions, form elements
- [ ] **Edge** (latest) — Layout, interactions (Chromium-based, low-risk)

### Mobile Browsers

- [ ] **Safari iOS** (latest) — Touch targets, viewport scaling, safe areas
- [ ] **Chrome Android** (latest) — Touch targets, viewport scaling
- [ ] **Samsung Internet** (latest) — Layout, font rendering

### What to check on each browser

1. Homepage renders correctly with all sections visible
2. Navigation works (links, language switcher)
3. Responsive breakpoints hold (320px, 375px, 768px, 1280px, 1440px)
4. Images load and are properly sized
5. Fonts render correctly (check for FOUT/FOIT)
6. Focus rings are visible on keyboard navigation
7. No horizontal overflow at any viewport
8. Contact form (when present) submits correctly

### When to test manually

- Before each Client delivery
- After significant CSS/layout changes
- When adding new browser-specific polyfills or features

## Feature Delivery Pipeline

A 7-step pipeline from roadmap milestone to verified feature. Each step produces a named artifact that the next step consumes. Every feature's artifacts live together in one directory: `.scratch/features/<id>-<slug>/`.

The [`features-cli`](../features-cli.md) tool is the connective tissue across the whole pipeline — it tracks which feature is active, registers features, manages issue state and blockers, and reports overall project state. Skills resolve the active feature with `pnpm features-cli get-feature` and never hand-edit the status JSON files.

### Pipeline

| Step | Skill                | Produces                                                                                                        | Why                                                                                                                                | Lives at                                                  |
| ---- | -------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1    | `milestone-to-briefs`| **Feature briefs** — one mini-PRD per feature (scope, acceptance criteria, in/out of scope), plus each feature registered in `features-status.json` | Decomposes one roadmap milestone into independently-buildable features. Establishes the build order (type/phase/dependencies)      | `.scratch/features/<id>-<slug>/BRIEF.md`                  |
| 2    | `grill-with-docs`    | **Grilling session state** — decision tree (N1–Nn nodes), constraints, open leaves; plus inline `CONTEXT.md`/ADR updates | Stress-tests the brief against the domain model. Resumable machine-readable checkpoint — survives across sessions with no conversation history | `.scratch/features/<id>-<slug>/GRILL_SESSION.md`          |
| 3    | `to-prd`             | **PRD (HLD)** — problem statement, user stories, implementation decisions, testing decisions, out-of-scope, plus a **feature registry** mapping to existing features | Refines the resolved grilling session into the single source of truth for _what_ we're building and _why_. Drops the Q&A; keeps conclusions | `.scratch/features/<id>-<slug>/PRD.md`                    |
| 4    | `to-issues`          | **Vertical-slice issues** — each with acceptance criteria, complexity, blocked-by, HITL/AFK label              | Independently grabbable work units. Tracer bullets through all layers. The CLI regenerates `issues-status.json` from these files   | `.scratch/features/<id>-<slug>/issues/<NN>-<slug>.md`     |
| 5    | `do-issue`           | **Implemented code** — production code, tests, type definitions                                                 | The actual deliverable. Each issue's acceptance criteria are verifiable                                                            | `src/`, `scripts/`, test files                            |
| 6    | `review-feature`     | **Feature review report** — pass/fail per acceptance criterion, QA results, orphan detection, downstream impact | Automated gate between implementation and human sign-off. Catches integration gaps, dead code, and scope misses                    | `.scratch/features/<id>-<slug>/reviews/<NN>-review.md`    |
| 7    | _(manual)_           | **Human sign-off** — approval or list of changes needed; feature transitioned to `archived` + `finalStatus: done` via the CLI | Final authority. Human verifies the _experience_, not the plumbing                                                                 | `features-status.json` (via `features-cli update-feature`) |

### Naming conventions

- **Feature directories**: `.scratch/features/<id>-<slug>/` — `<id>` is the 3-digit zero-padded feature ID; one directory holds the brief, grilling session, PRD, issues, and reviews
- **Briefs**: `BRIEF.md` — one per feature directory
- **Grilling session state**: `GRILL_SESSION.md` — one per feature directory (per-branch responses, when used, go in `grill-responses/N<N>-response.md`)
- **PRD**: `PRD.md` — one per feature directory
- **Issues**: `issues/<NN>-<slug>.md` — `<NN>` zero-padded sequential index, which is also the issue ID; the CLI derives `issues-status.json` from these
- **Feature review reports**: `reviews/<NN>-review.md` — auto-incrementing numbered reviews (01, 02, …)
- **ADRs**: `docs/adr/<NNNN>-<topic>.md` — numbered, auto-incrementing
- **CONTEXT.md**: repo-root glossary — updated inline during grilling

### Artifact lifecycle

- `.scratch/features/<id>-<slug>/` artifacts live until the feature is shipped and verified — then they're archival
- Feature review reports in `reviews/` are archival alongside the feature's other artifacts
- `CONTEXT.md` and ADRs are permanent — they accumulate across features

### Flow between features

Steps 2–7 run once per feature. After step 7 (human sign-off), pick up the next feature from the registry — `pnpm features-cli get-feature` / `status` shows what's actionable — and re-enter at step 2 (`grill-with-docs`). Step 1 (`milestone-to-briefs`) only repeats when starting a new roadmap milestone.

### Key rules

- Every step must produce its named artifact before the next step begins
- The feature directory is the unit of work — every artifact for a feature lives under `.scratch/features/<id>-<slug>/`
- Never hand-edit `features-status.json` or `issues-status.json` — always go through `pnpm features-cli`
- If implementation (step 5) reveals a bad decision, go back to the grilling session (step 2) and re-run `to-prd` — do not patch around it silently
- Feature review (step 6) runs against the feature brief's acceptance criteria — not against "does the code look nice"
- Human sign-off (step 7) is always the final gate, never skipped
