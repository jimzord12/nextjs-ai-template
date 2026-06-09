---
name: review-feature
description: Automated feature-scoped review that verifies acceptance criteria, runs scoped QA, detects orphans, and produces a review report. Use after all issues in a feature are implemented, before human sign-off, or when user says "review feature", "review this feature", "run feature review", or mentions feature sign-off.
---

# Review Feature

Automated first-pass review of a completed feature. Produces a numbered review report under the feature directory.

Not a replacement for human review — catches integration gaps, dead code, scope misses, and test gaps before human review.

## Quick start

1. Identify the feature directory from `.scratch/features/` or user input (e.g., `010-project-state-tracking`)
2. Follow the process below
3. Write the report to `.scratch/features/<feature-dir>/reviews/<N>-review.md`

## Output convention

Review reports live alongside the feature they belong to:

```
.scratch/features/<feature-dir>/reviews/
├── 01-review.md
├── 02-review.md
└── ...
```

- **Path**: `.scratch/features/<feature-dir>/reviews/<N>-review.md`
- **Numbering**: Auto-incrementing two-digit (`01`, `02`, …). Scan existing `reviews/` directory to determine the next number. If no reviews exist, start at `01`.
- **Template**: Use [`docs/templates/FEATURE_REVIEW.template.md`](../../docs/templates/FEATURE_REVIEW.template.md) as the report structure.

## Process

### 1. Gather inputs

Read in parallel:
- `.scratch/features/<feature-dir>/brief.md` — acceptance criteria and scope
- `.scratch/features/<feature-dir>/` — LLD document if it exists
- `.scratch/features/<feature-dir>/issues/` — all closed issues
- Git diff for files changed since the feature started (or file list from issues)

### 2. Verify acceptance criteria

For each criterion in the brief:
- Search codebase for implementing code (symbols, functions, components, tests)
- Classify: **PASS** (evidence found with file/symbol), **FAIL** (no evidence), **UNCLEAR** (needs human judgment)
- Record specific file(s) and symbol(s) per criterion

### 3. Run scoped QA

Run only these, scoped to feature's changed files — do NOT run `pnpm qa`:

- `pnpm typecheck` — type errors in affected files
- `pnpm lint` — lint issues in affected files
- `pnpm test` — focus on failures in feature's test files

Report pass/fail per command with failure details.

### 4. Orphan detection

Check for:
- New exports (functions, types, constants) nothing imports
- Dead code paths introduced by the feature
- Files created but never referenced
- Interfaces/types defined but never used

Use `search` and `ast_grep` to verify each new export is imported somewhere.

### 5. Downstream impact (horizontal features only)

If the feature is horizontal (infrastructure):
- Verify dependent features in the registry still compile against changed/new interfaces
- Confirm public API matches the LLD specification
- Skip this section for vertical features

### 6. Produce report

1. Scan `.scratch/features/<feature-dir>/reviews/` for existing review files to determine the next number.
2. Write the report to `.scratch/features/<feature-dir>/reviews/<N>-review.md` using the template at `docs/templates/FEATURE_REVIEW.template.md`.

Recommendation logic:
- **READY FOR HUMAN REVIEW** if all criteria PASS, QA clean, no critical findings
- **NEEDS FIXES BEFORE REVIEW** if any criterion FAILs, QA has errors, or critical orphans found
