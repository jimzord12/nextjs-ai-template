Status: ready-for-agent
Method: tdd
Complexity: 4

# Guarded Issue Status Updates

## Parent

PRD: `.scratch/issues-manager-cli/PRD.md`

## What to build

Build the issue-status write flow that updates canonical issue workflow safely and keeps derived state in sync. The command should enforce the agreed transition graph by default, allow a constrained `--force` escape hatch for exceptional workflow recovery, and regenerate the derived issue read model in the same write operation.

This slice should also refresh issue-level and feature-level update timestamps and make sure status changes immediately affect downstream blockedness in regenerated state. The force path must remain narrow: it can bypass transition-graph checks, but it must still reject invalid structure and invalid workflow vocabulary.

The result is a complete end-to-end write path for issue workflow changes that stays explicit, fail-fast, and consistent with the rest of the tracker model.

## Acceptance criteria

- [ ] A status update command updates canonical issue markdown and regenerates the derived issue read model in the same operation
- [ ] Status updates enforce the transition graph by default
- [ ] A constrained `--force` path bypasses only transition-graph checks
- [ ] Structural validation still applies when `--force` is used
- [ ] Status-vocabulary validation still applies when `--force` is used
- [ ] Issue-level last-updated metadata is refreshed when an issue changes
- [ ] Feature-level last-updated metadata is refreshed when an issue changes
- [ ] When an issue reaches `done`, regenerated state reflects any newly unblocked downstream issues
- [ ] Focused domain tests cover valid transitions, invalid transitions, force behavior, and timestamp refresh behavior
- [ ] CLI smoke coverage verifies representative success and failure output for normal and forced status changes

## Blocked by

- `02-issue-inventory-for-a-feature`
- `03-canonical-blockers-and-actionable-filtering`

## Decomposition

This issue stays as one parent issue, but it should be implemented as a short sequence of smaller subtasks so the write path, regeneration path, and CLI behavior can be verified incrementally.

### 1. Define the status transition graph

**What to build**

Encode the allowed status transitions and the exact behavior of the constrained `--force` path.

**Acceptance criteria**

- [ ] Valid transitions are accepted
- [ ] Invalid transitions fail by default
- [ ] `--force` bypasses only transition-graph checks
- [ ] Structure and status vocabulary validation still apply under `--force`

**Blocked by**

None - can start immediately once the parent blockers are clear.

**Estimated complexity**

2

### 2. Write canonical status updates

**What to build**

Implement the markdown write path for `Status:` changes on an issue file, with validation before any file mutation happens.

**Acceptance criteria**

- [ ] Issue markdown is updated in place
- [ ] Invalid issue structure fails before writing
- [ ] Invalid workflow vocabulary fails before writing

**Blocked by**

1. Define the status transition graph

**Estimated complexity**

2

### 3. Refresh timestamps and regenerate derived state

**What to build**

Refresh issue-level and feature-level `lastUpdated` data and regenerate the derived issue read model in the same command.

**Acceptance criteria**

- [ ] Issue `lastUpdated` changes on successful writes
- [ ] Feature `lastUpdated` changes on successful writes
- [ ] Derived issue state regenerates in the same operation
- [ ] Newly unblocked downstream issues appear after a blocker reaches `done`

**Blocked by**

2. Write canonical status updates

**Estimated complexity**

3

### 4. Add CLI behavior and smoke coverage

**What to build**

Wire stdout-facing success and failure output for the status update flow, and add smoke coverage for normal and forced transitions.

**Acceptance criteria**

- [ ] Success output is self-contained and human-readable
- [ ] Failure output is descriptive
- [ ] Smoke tests cover representative normal transitions
- [ ] Smoke tests cover representative forced transitions

**Blocked by**

3. Refresh timestamps and regenerate derived state

**Estimated complexity**

2

### Dependency graph

1. Define the status transition graph -> 2. Write canonical status updates -> 3. Refresh timestamps and regenerate derived state -> 4. Add CLI behavior and smoke coverage
