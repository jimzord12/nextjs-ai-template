Method: tdd
Status: done
Complexity: 4
BlockedBy: 2

# Implement `status` command — milestones summary + feature pipeline state

## Parent

PRD: `.scratch/features/010-project-state-tracking/PRD.md`

## What to build

Add a `status` command to the CLI that outputs a full project state snapshot. This is the core of the feature — pure read-only aggregation from filesystem and `features-status.json`.

The command reads all feature records, groups them by milestone, scans each feature directory for pipeline artifacts, and outputs two sections.

### Section 1: Milestone summary

Collect unique milestone numbers from features. For each milestone, count:
- Total features
- Features `archived` + `finalStatus: done`
- Features with `status: in-progress`
- Derive milestone status: `not-started` (all todo), `in-progress` (at least one in-progress or some done but not all), `done` (all archived + done)

```
=== Milestones ===
  M1  | 3/9 done  | 1 in-progress  | in-progress
  M2  | 0/4 done  | 0 in-progress  | not-started
```

Features without a `milestone` field appear in an `Unassigned` group with a warning: `⚠ N feature(s) have no milestone assigned. Use update-feature <slug> --milestone <N> to assign.`

If more than one milestone has an `in-progress` feature, emit a warning: `⚠ Multiple milestones have in-progress features. Only one active milestone is expected.`

If no features exist at all, output: `No features registered.`

### Section 2: Feature pipeline state

For every feature, check filesystem under `.scratch/features/<feature-dir>/`:

| Field | Check |
|-------|-------|
| Has Grill Session | `GRILL_SESSION.md` exists |
| Has Brief | `BRIEF.md` exists |
| Has PRD | `PRD.md` exists |
| Has issues | `issues/` directory exists with `.md` files inside |
| Completed issues | Read `issues-status.json`, count terminal vs total |
| AI Review Passed | `reviews/` directory exists with `.md` files inside |
| Human Review Passed | Feature is `archived` + `finalStatus: done` |

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

For features where `Has issues` is false or `issues-status.json` doesn't exist, show `completed issues: —`. For `Human Review Passed`, only `true` when `archived` + `finalStatus: done`; everything else is `false`.

### Tests

New `describe("status command")` block in `cli.test.ts`:

- Empty state — no features registered
- All features `todo`, no milestones assigned — unassigned warning
- Features with milestones, all `todo` — milestone shows `not-started`
- One feature `in-progress` — milestone shows `in-progress`, active milestone identified
- Multiple milestones with `in-progress` features — warning emitted
- Feature with full pipeline artifacts — all `true`
- Feature with no artifacts — all `false`
- Feature `archived` + `done` — `Human Review Passed: true`
- Feature `archived` + `cancelled` — `Human Review Passed: false`
- Feature with issues but none done — `completed issues: 0/5`
- Feature with issues, some done — `completed issues: 3/7`
- Feature without `issues-status.json` — `completed issues: —`
- Feature with `reviews/` dir containing `.md` files — `AI Review Passed: true`
- Feature with `reviews/` dir but empty — `AI Review Passed: false`
- Feature missing milestone — appears in output, unassigned warning shown

## Acceptance criteria

- [x] `features-cli status` outputs milestone summary section
- [x] `features-cli status` outputs per-feature pipeline state section
- [x] Milestone status correctly derived as `not-started`, `in-progress`, or `done`
- [x] Warning shown when multiple milestones have in-progress features
- [x] Warning shown for features without a milestone
- [x] All pipeline artifact checks correctly detect file/directory presence
- [x] `completed issues` shows count/total when issues exist, `—` when not
- [x] `Human Review Passed` is `true` only for `archived` + `finalStatus: done`
- [x] `AI Review Passed` is `true` when `reviews/` has `.md` files
- [x] All tests pass

## Blocked by

- `02-milestone-field-and-flag` — requires milestone field on feature records


