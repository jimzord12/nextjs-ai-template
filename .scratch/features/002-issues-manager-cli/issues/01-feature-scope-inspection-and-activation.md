Status: done
Method: tdd
Complexity: 3
BlockedBy: none

# Feature Scope Inspection And Activation

## Parent

PRD: `.scratch/issues-manager-cli/PRD.md`

## What to build

Build the fail-fast feature-state foundation for the Issues Manager CLI. The CLI must validate the canonical feature workflow model, resolve the current feature from the single feature marked `in-progress`, and expose a narrow feature command surface for inspection and explicit activation changes.

This slice should make feature scope dependable before any issue-centric command runs. Commands that rely on implicit current-feature resolution must stop with descriptive errors when there is no active feature or when more than one feature is marked `in-progress`. The write path should support explicit feature workflow updates without auto-demoting another feature behind the operator's back.

The result is a stable end-to-end path for validating tracker state, inspecting feature workflow, and deliberately changing which feature is active.

## Acceptance criteria

- [x] The CLI validates feature workflow state before any command that depends on implicit current-feature resolution
- [x] The current feature is derived from the single feature marked `in-progress`
- [x] Commands that depend on the current feature fail with a descriptive error when zero features are `in-progress`
- [x] Commands that depend on the current feature fail with a descriptive error when more than one feature is `in-progress`
- [x] A narrow feature inspection command returns self-contained human-readable output
- [x] A narrow feature update command can explicitly change feature workflow state without auto-demoting another active feature
- [x] Setting a feature to `in-progress` fails if another feature is already `in-progress`
- [x] Focus-changing guidance in errors directs the operator to explicitly activate a feature before current-feature-dependent commands run
- [x] Focused domain tests cover valid state, no-current-feature, and ambiguous-current-feature cases
- [x] CLI smoke coverage verifies representative success and failure output for feature inspection and feature updates

