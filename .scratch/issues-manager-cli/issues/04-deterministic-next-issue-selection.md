Status: done
Method: tdd
Complexity: 3

# Deterministic Next-Issue Selection

## Parent

PRD: `.scratch/issues-manager-cli/PRD.md`

## What to build

Build the deterministic next-issue command on top of validated feature scope and blocker-aware actionable filtering. The command should inspect either the current feature or an explicitly named feature, select from truly actionable issues only, and return a self-contained text result that includes feature context and the chosen issue path.

This slice should also lock down the no-winner contract. The command must distinguish the cases where a feature has no issues, where all issues are terminal, and where issues exist but none are actionable, while preserving the agreed success versus non-zero behavior.

The result is a stable end-to-end path for repeatable issue selection that does not depend on personal judgment.

## Acceptance criteria

- [x] A next-issue command selects only unblocked `ready-for-agent` issues
- [x] Deterministic ordering sorts by complexity ascending and then issue ID ascending
- [x] The command supports both current-feature resolution and explicit feature targeting
- [x] Result output includes current feature metadata or explicit feature metadata plus the selected issue path
- [x] When no issues exist, the command returns the `empty` no-winner outcome as a successful result
- [x] When every issue is terminal, the command returns the `complete` no-winner outcome as a successful result
- [x] When issues exist but none are actionable, the command returns the `no-actionable` no-winner outcome as a non-zero result
- [x] The terminal-status set is explicit and initially includes `done` and `wontfix`
- [x] Focused domain tests cover deterministic ordering and all three no-winner outcomes
- [x] CLI smoke coverage verifies representative stdout text and exit-code behavior for winner and no-winner cases

## Blocked by

- `02-issue-inventory-for-a-feature`
- `03-canonical-blockers-and-actionable-filtering`
