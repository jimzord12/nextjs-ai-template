Status: ready-for-agent
Method: tdd
Complexity: 3

# Issue Inventory For A Feature

## Parent

PRD: `.scratch/issues-manager-cli/PRD.md`

## What to build

Build the read path that shows the full issue inventory for a feature. By default, the command should inspect the current feature, and it should also support explicit feature targeting so an operator can inspect any existing feature without first changing the active one.

This slice should use the derived issue read model for fast reads, return self-contained text that includes feature context and issue paths, and make the CLI useful for day-to-day status inspection before any blocker-aware or selection logic is layered on.

The result is a reliable end-to-end path for validating scope, reading feature issue state, and producing actionable text output without opening each issue file manually.

## Acceptance criteria

- [ ] A list command returns all issues for the current feature by default
- [ ] The same command accepts an explicit feature target and works regardless of that feature's workflow status
- [ ] Explicit feature targeting does not depend on current-feature resolution
- [ ] Read output includes feature metadata, issue summaries, and issue file paths
- [ ] The command reads from the derived issue read model rather than reparsing issue markdown on every call
- [ ] The command fails descriptively when the derived issue read model is missing or malformed
- [ ] Focused domain tests cover current-feature reads, explicit-feature reads, and invalid derived-state cases
- [ ] CLI smoke coverage verifies representative list output for both implicit and explicit feature modes

## Blocked by

- `01-feature-scope-inspection-and-activation`
