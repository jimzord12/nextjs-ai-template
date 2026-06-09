Status: done
Method: tdd
Complexity: 5
BlockedBy: 2

# Canonical Blockers And Actionable Filtering

## Parent

PRD: `.scratch/issues-manager-cli/PRD.md`

## What to build

Build the canonical blocker contract and the actionable-filtering rules that the CLI will trust. The issue workflow must use one parseable blocker field, derive blockedness from unresolved dependencies, reject invalid blocker graphs, and regenerate the derived issue read model whenever blocker data changes.

This slice should also define the normalization boundary. Blocker-aware commands must fail on legacy prose-only blocker sections, while the explicit blocker update flow may normalize a legacy issue when the operator provides canonical blocker data. Once normalized, issues must represent no blockers explicitly rather than relying on omission or prose.

The result is a dependable end-to-end path from canonical issue metadata through derived blockedness to an actionable issue list the CLI can use without hidden judgment.

## Acceptance criteria

- [x] The canonical blocker field is `BlockedBy: none` or `BlockedBy: <id list>`
- [x] Blocker references are validated against issues in the same feature
- [x] Self-dependencies are rejected with a descriptive error
- [x] Duplicate blocker IDs are rejected with a descriptive error
- [x] Blockedness is derived from unresolved blockers rather than stored as a separate status
- [x] Downstream issues unblock only when blocker issues reach `done`
- [x] A blocker on an issue in `wontfix` does not auto-unblock dependent work
- [x] Blocker-aware commands fail descriptively when they encounter legacy prose-only blocker sections
- [x] The explicit blocker update flow can normalize a legacy issue when canonical blocker data is supplied
- [x] Feature-wide regeneration fails if any issue remains outside the canonical blocker contract
- [x] The actionable issue filter excludes blocked issues automatically
- [x] Focused domain tests cover normalization, invalid references, duplicate blockers, self-dependencies, blockedness derivation, and actionable filtering
- [x] CLI smoke coverage verifies representative blocker-update output and actionable filtering behavior

## Blocked by

- `02-issue-inventory-for-a-feature`

## Decomposition

This issue is rated `Complexity: 5` because it combines a new canonical metadata contract, blocker-graph validation, normalization policy, and derived-state regeneration. Use the following subtasks as the default implementation order, or as candidate child issues if this parent is later split.

### 1. Define canonical blocker parsing

**What to build**

Parse `BlockedBy: none` and `BlockedBy: <id list>` into one normalized internal shape, and detect legacy prose-only blocker sections explicitly rather than guessing.

**Acceptance criteria**

- [x] Canonical blocker headers parse into a normalized internal blocker shape
- [x] Missing or malformed canonical blocker headers fail with a descriptive error
- [x] Legacy prose-only blocker sections are detected explicitly

**Blocked by**

None - can start immediately.

**Estimated complexity**

2

### 2. Validate blocker graphs

**What to build**

Validate blocker references against issues in the same feature, reject duplicate and self-referential blocker lists, and derive blockedness from unresolved blocker statuses.

**Acceptance criteria**

- [x] Missing blocker references fail descriptively
- [x] Cross-feature blocker references fail descriptively
- [x] Self-dependencies are rejected
- [x] Duplicate blocker IDs are rejected
- [x] Blockedness depends only on unresolved blockers
- [x] A blocker in `wontfix` does not unblock downstream work

**Blocked by**

1. Define canonical blocker parsing

**Estimated complexity**

3

### 3. Implement blocker update and normalization flow

**What to build**

Implement the explicit blocker update write path that can normalize a legacy issue only when canonical blocker data is supplied, and always writes `BlockedBy: none` when no blockers remain.

**Acceptance criteria**

- [x] `update-blockers` rewrites canonical issue metadata
- [x] Legacy issues can be normalized only through the explicit blocker-update flow
- [x] `BlockedBy: none` is written explicitly when an issue has no blockers

**Blocked by**

2. Validate blocker graphs

**Estimated complexity**

3

### 4. Regenerate read model and actionable filtering

**What to build**

Regenerate derived issue state after blocker updates and expose actionable filtering that excludes blocked issues automatically.

**Acceptance criteria**

- [x] Feature-wide regeneration fails if any issue remains outside the canonical blocker contract
- [x] Derived state reflects blockedness correctly after blocker changes
- [x] Actionable filtering excludes blocked issues automatically
- [x] CLI smoke tests cover blocker-update output and actionable filtering behavior

**Blocked by**

3. Implement blocker update and normalization flow

**Estimated complexity**

3

### Dependency graph

1. Define canonical blocker parsing -> 2. Validate blocker graphs -> 3. Implement blocker update and normalization flow -> 4. Regenerate read model and actionable filtering
