# PRD Template

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories in the format:

1. As an <actor>, I want a <feature>, so that <benefit>

This list should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets (they become outdated).
Exception: if a prototype produced a snippet that encodes a decision more precisely than prose (state machine, reducer, schema, type shape), inline it and note it came from a prototype.

## Testing Decisions

A list of testing decisions:

- What makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for tests (similar types of tests in the codebase)

## Out of Scope

Things that are out of scope for this PRD.

## Further Notes

Any further notes about the feature.

## Triage

Status: ready-for-agent

---

# Feature Registry Format

A table inside the PRD, after the Further Notes section:

| Name | Type | Phase | Dependencies | Description |
|------|------|-------|-------------|-------------|
| `feature-slug` | vertical / horizontal | 1 | none | 1-2 sentence description |

- **vertical**: end-to-end demoable slice
- **horizontal**: infrastructure/foundation other features depend on
- Phase groups features that should be built together
- Dependencies reference other feature slugs from this registry
- Horizontal features should appear before the vertical features that need them

---

# Feature Brief Template

For each feature in the registry, create a separate brief.

```md
# <Feature Name>

**Type**: vertical / horizontal
**Phase**: N
**Dependencies**: list of feature slugs (or "none")

## Scope

What this feature includes.

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] ...

## Out of Scope

What this feature does NOT include.

## Notes

Any additional context for this feature.
```
