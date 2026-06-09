# PRD — Project State Tracking

## Problem Statement

There is no way to answer "where are we?" without manually cross-referencing `ROADMAP.md`, `features-status.json`, and the `.scratch/features/` directory. The agent or developer has to read multiple files, check which features have briefs, PRDs, issues, and reviews, then mentally compute progress per milestone. This is slow, error-prone, and wastes context window on mechanical status checks.

## Solution

Extend the existing `issues-manager-cli` (renamed to `features-cli`) with a `status` command that reads the filesystem and `features-status.json`, then outputs a complete project state snapshot — milestone progress, per-feature pipeline state, and issue breakdowns for active features. All data is derived; nothing new is stored except a `milestone` field on each feature record.

Additionally, introduce a review artifact convention (`reviews/` directory under each feature) and a review report template, relocating review output from `.qa/` to `.scratch/features/` so all feature data lives in one place.

## User Stories

1. As an agent, I want a single command that shows the full project state, so that I can decide what to work on next without reading multiple files.
2. As an agent, I want to see which milestone is active, so that I know which phase of the roadmap is in progress.
3. As an agent, I want to see per-feature pipeline progress (grill session, brief, PRD, issues, reviews), so that I know where each feature stands in the delivery pipeline.
4. As an agent, I want to see the issue breakdown for the active feature, so that I can pick up the next issue without running a separate command.
5. As an agent, I want milestone membership stored on each feature, so that the CLI can group features by milestone without parsing ROADMAP.md.
6. As an agent, I want to assign a milestone to a feature via the CLI, so that I don't have to hand-edit JSON.
7. As an agent, I want a warning when more than one milestone has in-progress features, so that I catch data inconsistencies early.
8. As an agent, I want unassigned features surfaced with a warning, so that I notice features missing a milestone during the migration period.
9. As a developer, I want the tool renamed to `features-cli`, so that the name reflects its broader scope beyond issue management.
10. As a developer, I want review reports stored alongside the feature they belong to, so that all feature artifacts are in one directory.
11. As a developer, I want multiple review attempts supported (numbered files), so that the review-rework cycle is visible.
12. As a developer, I want a review report template, so that reviews follow a consistent structure.

## Implementation Decisions

### Rename: `issues-manager-cli` → `features-cli`

- Rename `scripts/issues-manager-cli/` directory to `scripts/features-cli/`.
- Rename `issues-manager-cli.md` at repo root to `features-cli.md`.
- Update `package.json` script: `features-cli: bun scripts/features-cli/bin.ts`.
- Update all references in skill files (`do-issue`, `to-issues`, `to-prd`, `grill-with-docs`, `milestone-to-briefs`, `METHODS.md`), `AGENTS.md`, and `.scratch/features-status.json` test data.
- The rename is a separate, precursor issue — no logic changes, pure find-and-replace.

### Schema change: `milestone` field on feature records

Each feature record in `features-status.json` gains an optional `milestone` field (positive integer). The `validateFeatureRecord` function in `features-state.ts` parses and validates it. Missing `milestone` is allowed (graceful degradation during migration).

Schema shape:
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

### `update-feature` extension: `--milestone` flag

The existing `update-feature` command accepts a new optional `--milestone <number>` flag. The CLI validates that the value is a positive integer. When provided, the milestone field is written to `features-status.json` alongside any status change. The flag can be used alone (`update-feature <slug> --milestone 1`) or combined with `--status`.

### `status` command

A new command branch in `cli.ts`: `features-cli status`. Pure read-only aggregation — reads `features-status.json`, scans feature directories for pipeline artifacts, reads `issues-status.json` for active features.

Output has three sections:

**1. Milestone summary** — derived by collecting unique milestone numbers from features, then computing per-milestone counts:

```
=== Milestones ===
  M1  | 3/9 done  | 1 in-progress  | in-progress
  M2  | 0/4 done  | 0 in-progress  | not-started
```

Milestone status derivation:
- `not-started` — all features are `todo`
- `in-progress` — at least one feature is `in-progress`, or some features are done but not all
- `done` — all features are `archived` with `finalStatus: done`

Active milestone = any milestone with an `in-progress` feature. If >1, emit a warning.

Features without a `milestone` field appear in an `Unassigned` row with a warning.

**2. Feature pipeline state** — for every feature, check filesystem for pipeline artifacts:

```
> Feature: 003-cms-adapter-interface (in-progress)
  - milestone: M1
  - Has Grill Session: true
  - Has Brief: true
  - Has PRD: false
  - Has issues: true
  - completed issues: 3/7
  - AI Review Passed: false
  - Human Review Passed: false
```

Artifact detection (all filesystem checks under `.scratch/features/<feature-dir>/`):

| Field | Check |
|-------|-------|
| Has Grill Session | `GRILL_SESSION.md` exists |
| Has Brief | `BRIEF.md` exists |
| Has PRD | `PRD.md` exists |
| Has issues | `issues/` directory exists with `.md` files |
| Completed issues | Count from `issues-status.json` where `status` is terminal |
| AI Review Passed | `reviews/` directory exists with `.md` files |
| Human Review Passed | Feature is `archived` + `finalStatus: done` |

**3. Issue breakdown** — only for `in-progress` features, read `issues-status.json` and list each issue with title + status:

```
  - Issues:
    - #01 Fix config aliases          [done]
    - #02 Version pinning audit       [done]
    - #04 Local CMS foundation        [ready-for-agent]
```

Features that are not `in-progress` show no issue breakdown — just the pipeline state.

### Review artifact convention

- Review reports move from `.qa/feature-reviews/` to `.scratch/features/<feature-dir>/reviews/`.
- Files are auto-incrementing: `01-review.md`, `02-review.md`, ...
- New template: `docs/templates/FEATURE_REVIEW.template.md`.
- The `review-feature` skill is updated to write to the new path using the template.

## Testing Decisions

- **Test seam**: `runIssuesManagerCli` entry point with temp directories, matching existing pattern in `cli.test.ts`. Each test constructs a `.scratch/` tree with the necessary files and asserts on `stdout`/`stderr`/`exitCode`.
- **Feature state tests**: Extend `features-state.test.ts` to cover `milestone` field validation (present, absent, non-integer, negative) and `updateFeatureStatus` with `--milestone`.
- **Status command tests**: New `describe` block in `cli.test.ts` covering:
  - Empty state (no features)
  - All features `todo`, no milestones
  - One feature `in-progress` with full pipeline artifacts
  - One feature `in-progress` with partial artifacts
  - Multiple milestones
  - Warning on multiple active milestones
  - Warning on unassigned features
  - Issue breakdown for active feature
  - No issue breakdown for non-active features
  - `archived` + `done` feature shows `Human Review Passed: true`
  - Reviews directory detection
- No new test files — logic lives in existing modules.

## Out of Scope

- Scoping flags on `status` command (e.g. `--milestone`, `--feature`) — always flat for now.
- Parsing `ROADMAP.md` for milestone titles — the CLI uses milestone numbers only.
- Migrating existing review reports from `.qa/feature-reviews/` to the new location — new convention applies going forward.
- Updating `CONTEXT.md` with a "Features CLI" term — handled as part of the rename issue.
- Automated milestone assignment from ROADMAP.md.
- Historical tracking or trend data in the status output.

## Further Notes

### Migration path

After deployment, each existing feature in `features-status.json` needs a `milestone` field added. This is a one-time manual edit or can be done via `update-feature <slug> --milestone N` for each feature. The CLI handles missing milestone gracefully (unassigned group + warning) so there's no breakage during transition.

### Two issues

1. **Rename** (precursor) — `issues-manager-cli` → `features-cli`. Mechanical find-and-replace across all files. No logic changes. Test suite passes unchanged after rename.
2. **Milestone tracking + status command** — schema change, `--milestone` flag, `status` command, review convention, review template, `review-feature` skill update.

## Triage

Status: ready-for-agent

---

## Feature Registry

| Name | Type | Phase | Dependencies | Description |
|------|------|-------|-------------|-------------|
| `rename-to-features-cli` | horizontal | 1 | none | Mechanical rename of `issues-manager-cli` → `features-cli` across all files: directory, package.json script, skill references, spec file, test imports |
| `milestone-tracking-and-status` | vertical | 1 | `rename-to-features-cli` | Add `milestone` field to feature records, extend `update-feature` with `--milestone`, implement `status` command, establish review artifact convention with template |
