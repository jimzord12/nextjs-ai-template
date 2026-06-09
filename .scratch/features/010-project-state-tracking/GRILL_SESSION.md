# Grilling Session — 010-project-state-tracking

**Date:** 2026-06-09
**Status:** Complete — ready for `to-prd`

## Context

Extend the existing `issues-manager-cli` tool to support milestone-level tracking and add a `status` command that gives a full project state snapshot. The tool gets renamed to `features-cli` as a precursor.

## Decision Tree

### N1: Status command output format
**Answer:** Always flat, no flags. Single command `features-cli status` dumps everything.

### N2: Milestone field shape
**Answer:** `milestone: <number>` on each feature record in `features-status.json`. Titles and descriptions live in ROADMAP.md.

### N3: Milestone list source
**Answer:** Derived from unique milestone numbers across all features. No top-level `milestones` array.

### N4: Active milestone definition
**Answer:** Any milestone with at least one `in-progress` feature. **Warn if >1 active milestone** (single active milestone invariant).

### N5: Feature grouping in output
**Answer:** Three sections:
1. Milestone summary table (done/in-progress counts)
2. Per-feature pipeline state (all features)
3. Issue breakdown (only for `in-progress` features)

### N6: Issue fields in breakdown
**Answer:** Title + status only. Minimal. Use `list-issues` / `get-issue` for detail.

### N7: Milestone status derivation
**Answer:** Three states derived from feature statuses:
- `not-started` — all features are `todo`
- `in-progress` — at least one feature is `in-progress` or some features done but not all
- `done` — all features are `archived` + `finalStatus: done`

### N8: Rename strategy
**Answer:** Separate precursor issue. Rename `issues-manager-cli` → `features-cli` first, then add new feature. Clean history, independent review/revert.

### N9: Pipeline artifact checks
**Answer:** Three checks, all filesystem-derived:
- Has Grill Session — `GRILL_SESSION.md` exists
- Has Brief — `BRIEF.md` exists
- Has PRD — `PRD.md` exists
- No LLD (deprecated)

### N10: AI Review Passed
**Answer:** `.scratch/features/<feature-dir>/reviews/` directory exists with at least one `.md` file.

**New conventions:**
- Review files: `.scratch/features/<feature-dir>/reviews/01-review.md`, `02-review.md`, ...
- New template: `docs/templates/FEATURE_REVIEW.template.md`
- Update `review-feature` skill to use new path + template

### N10b: Review file naming
**Answer:** Auto-incrementing number — `01-review.md`, `02-review.md`, ...

### N11: Human Review Passed
**Answer:** Binary. Derived from `feature.status === "archived" && feature.finalStatus === "done"`.

### N12: Status command nature
**Answer:** Pure read-only aggregation. No new stored fields except `milestone` on feature records.

### N13: Missing milestone handling
**Answer:** Graceful — show in `unassigned` group with warning.

### N14: Milestone assignment
**Answer:** Extend `update-feature` with `--milestone <number>` flag.

### N15: Additional output
**Answer:** Nothing else for now.

## Open Leaves

None — all branches resolved.

## Resulting Changes

### Schema change to features-status.json
```json
{
  "id": 3,
  "slug": "cms-adapter-interface",
  "milestone": 1,
  "status": "in-progress",
  "lastUpdated": "...",
  "finalStatus": null
}
```

### New `status` command output shape
```
=== Milestones ===
  M1  | 3/9 done  | 1 in-progress  | in-progress
  M2  | 0/4 done  | 0 in-progress  | not-started

=== Features ===
> Feature: 003-cms-adapter-interface (in-progress)
  - milestone: M1
  - Has Grill Session: true
  - Has Brief: true
  - Has PRD: false
  - Has issues: true
  - completed issues: 3/7
  - AI Review Passed: false
  - Human Review Passed: false
  - Issues:
    - #01 Fix config aliases          [done]
    - #02 Version pinning audit       [done]
    - #03 I18n routing skeleton       [done]
    - #04 Local CMS foundation        [ready-for-agent]

> Feature: 004-content-model-schemas (todo)
  - Has Grill Session: false
  - Has Brief: true
  - Has PRD: false
  - Has issues: false
  - completed issues: —
  - AI Review Passed: false
  - Human Review Passed: false
```

### Two issues
1. **Rename** — `issues-manager-cli` → `features-cli` (mechanical precursor)
2. **Milestone tracking + status command** — schema change + new command

### New files
- `docs/templates/FEATURE_REVIEW.template.md`
- `.scratch/features/<feature-dir>/reviews/01-review.md` (at review time)

### Files to update
- `.scratch/features-status.json` — add `milestone` per feature
- `scripts/issues-manager-cli/` → rename to `scripts/features-cli/`
- `issues-manager-cli.md` → rename to `features-cli.md`
- `review-feature` skill — update review path + template
- `CONTEXT.md` — add Features CLI term
- All references to old CLI name across codebase
