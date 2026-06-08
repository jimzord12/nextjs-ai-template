---
name: review-feature
description: Automated feature-scoped review that verifies acceptance criteria, runs scoped QA, detects orphans, and produces a review report. Use after all issues in a feature are implemented, before human sign-off, or when user says "review feature", "review this feature", "run feature review", or mentions feature sign-off.
---

# Review Feature

Automated first-pass review of a completed feature. Produces a report at `.qa/feature-reviews/<feature-name>.md`.

Not a replacement for human review — catches integration gaps, dead code, scope misses, and test gaps before human review.

## Quick start

1. Identify the feature name from `.scratch/` directories or user input
2. Follow the process below
3. Write the report to `.qa/feature-reviews/<feature-name>.md`

## Process

### 1. Gather inputs

Read in parallel:
- `.scratch/<feature-name>/brief.md` — acceptance criteria and scope
- `.scratch/<feature-name>/` — LLD document if it exists
- `.scratch/<feature-name>/issues/` — all closed issues
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

Write to `.qa/feature-reviews/<feature-name>.md`:

```md
# Feature Review: <feature-name>

## Summary
<PASS/FAIL> — X/Y acceptance criteria met, Z findings

## Acceptance Criteria
| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | ... | PASS/FAIL/UNCLEAR | file.ts:symbol |

## QA Results
| Check | Result | Details |
|-------|--------|---------|
| typecheck | PASS/FAIL | ... |
| lint | PASS/FAIL | ... |
| test | PASS/FAIL | ... |

## Findings
- [ORPHAN] export X in file.ts — no importers found
- [DEAD] unreachable branch in file.ts:L42
- [GAP] no test for X

## Downstream Impact
<horizontal only — compatibility check results, or "N/A — vertical feature">

## Recommendation
<READY FOR HUMAN REVIEW / NEEDS FIXES BEFORE REVIEW>
```

Recommendation logic:
- **READY FOR HUMAN REVIEW** if all criteria PASS, QA clean, no critical findings
- **NEEDS FIXES BEFORE REVIEW** if any criterion FAILs, QA has errors, or critical orphans found
