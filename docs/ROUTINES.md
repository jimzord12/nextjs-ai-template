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
| `pnpm qa:seo`           | Runs Lighthouse SEO audits against all locale pages, asserts each page meets the SEO score gate (≥ 80) | `.qa/seo-result-<locale>.report.html`, `.qa/seo-summary.json` |
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

The `.qa/` directory is the QA delivery package — the artifact you screenshot into a client-facing summary.

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

A 7-step pipeline from idea to verified feature. Each step produces a named artifact that the next step consumes.

### Pipeline

| Step | Skill             | Produces                                                                                                        | Why                                                                                                                                | Lives at                                           |
| ---- | ----------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1    | `grill-with-docs` | **Grilling session state** — decision tree (N1–Nn nodes), constraints, open leaves                              | Machine-readable checkpoint of resolved decisions. Enables downstream skills to run in fresh sessions without conversation history | `tmp/<slug>.grilling-session-state.md`             |
| 2    | `to-prd`          | **HLD document** — problem statement, user stories, implementation decisions, testing decisions, out-of-scope   | Single source of truth for _what_ we're building and _why_. User stories feed acceptance criteria downstream                       | Issue tracker (`.scratch/<feature>/`)              |
|      |                   | **Feature registry** — ordered list of features with name, type (vertical/horizontal), phase, dependencies      | Build sequence map. Answers "what's next?" and "what's blocked by what?"                                                           | Section within HLD issue                           |
|      |                   | **Feature briefs** — mini-PRD per feature (scope, acceptance criteria, in/out of scope)                         | Input to per-feature LLD grilling. Keeps each session focused on one feature's boundaries                                          | One issue per feature (`.scratch/<feature-name>/`) |
| 3    | `grill-with-docs` | **LLD document** — per-feature low-level design (interfaces, data flow, contracts, file layout)                 | Turns "what" into "how." The implementable spec for `to-issues` to decompose                                                       | `.scratch/<feature-name>/`                         |
|      |                   | **CONTEXT.md updates** — new/resolved domain terms                                                              | Terminology captured inline. Prevents glossary drift                                                                               | `CONTEXT.md`                                       |
|      |                   | **ADRs** — architectural decision records (sparse, only when criteria met)                                      | Irreversible or non-obvious decisions documented for future readers                                                                | `docs/adr/<NNNN>-<topic>.md`                       |
| 4    | `to-issues`       | **Vertical-slice issues** — each with acceptance criteria, blocked-by, HITL/AFK label                           | Independently grabbable work units. Tracer bullets through all layers                                                              | `.scratch/<feature-name>/<slice-id>.md`            |
| 5    | `do-issue`        | **Implemented code** — production code, tests, type definitions                                                 | The actual deliverable. Each issue's acceptance criteria are verifiable                                                            | `src/`, `tests/`                                   |
| 6    | `review-feature`  | **Feature review report** — pass/fail per acceptance criterion, QA results, orphan detection, downstream impact | Automated gate between implementation and human sign-off. Catches integration gaps, dead code, and scope misses                    | `.scratch/features/<feature-dir>/reviews/<N>-review.md` |
| 7    | _(manual)_        | **Human sign-off** — approval or list of changes needed                                                         | Final authority. Human verifies the _experience_, not the plumbing                                                                 | Verbal / commit comment / issue status change      |

### Naming conventions

- **Session state files**: `tmp/<slug>.grilling-session-state.md` — slug is a short kebab-case topic identifier
- **Feature directories**: `.scratch/<feature-name>/` — one directory per feature, contains HLD section, LLD, and slice issues
- **Feature review reports**: `.scratch/features/<feature-dir>/reviews/<N>-review.md` — auto-incrementing numbered reviews (01, 02, …) stored in the feature directory
- **ADRs**: `docs/adr/<NNNN>-<topic>.md` — numbered, auto-incrementing

### Artifact lifecycle

- `tmp/` files are session-scoped — disposable after the pipeline moves past them
- `.scratch/` files live until the feature is shipped and verified — then they're archival
- Feature review reports in `.scratch/features/<feature-dir>/reviews/` are archival alongside the feature's other artifacts
- `CONTEXT.md` and ADRs are permanent — they accumulate across features

### Flow between features

After step 7 (human sign-off), the pipeline loops back to step 3 for the next feature in the registry. Steps 1–2 (vision grilling → HLD) only repeat when starting a new product area or major phase.

### Key rules

- Every step must produce its named artifact before the next step begins
- If implementation (step 5) reveals a bad decision, go back to the LLD grilling (step 3) — do not patch around it silently
- Feature review (step 6) runs against the feature brief's acceptance criteria — not against "does the code look nice"
- Human sign-off (step 7) is always the final gate, never skipped
