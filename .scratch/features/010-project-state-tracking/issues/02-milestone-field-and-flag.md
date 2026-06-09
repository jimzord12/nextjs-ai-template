Method: tdd
Status: done
Complexity: 3
BlockedBy: 1

# Add `milestone` field to feature schema and `--milestone` flag

## Parent

PRD: `.scratch/features/010-project-state-tracking/PRD.md`

## What to build

Extend `features-status.json` with an optional `milestone` field (positive integer) on each feature record. Add `--milestone` flag to the `update-feature` command. Validate the field on read and write.

Changes:

1. **Schema extension** — `FeatureRecord` type gains optional `milestone?: number`. The `validateFeatureRecord` function in `features-state.ts` parses and validates it: if present, must be a positive integer. Missing is allowed (graceful degradation for existing data).

2. **`update-feature --milestone`** — the CLI's `update-feature` branch accepts a new optional `--milestone <number>` flag. Validates the value is a positive integer. Writes the milestone field to `features-status.json`. Can be used alone or combined with `--status`.

3. **Tests** — extend `features-state.test.ts`:
   - `validateFeatureRecord` accepts a valid milestone
   - `validateFeatureRecord` accepts missing milestone (undefined)
   - `validateFeatureRecord` rejects non-integer milestone
   - `validateFeatureRecord` rejects zero or negative milestone
   - `updateFeatureStatus` writes milestone when provided
   - `updateFeatureStatus` preserves existing milestone when not provided
   - CLI integration: `update-feature <slug> --milestone 1` succeeds
   - CLI integration: `update-feature <slug> --milestone 0` fails with validation error
   - CLI integration: `update-feature <slug> --milestone abc` fails with validation error

## Acceptance criteria

- [x] `FeatureRecord` type includes optional `milestone` field
- [x] `validateFeatureRecord` accepts valid milestone, rejects invalid, allows missing
- [x] `update-feature <slug> --milestone 1` writes milestone to `features-status.json`
- [x] `update-feature <slug> --milestone 0` fails with descriptive error
- [x] `update-feature <slug> --status in-progress` preserves existing milestone
- [x] All new tests pass

## Blocked by

- `01-rename-to-features-cli` — must use the new directory structure and CLI name


