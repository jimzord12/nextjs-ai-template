Method: tdd
Status: done
Complexity: 2
BlockedBy: 3

# Extend `status` command — issue breakdown for active features

## Parent

PRD: `.scratch/features/010-project-state-tracking/PRD.md`

## What to build

Extend the `status` command output with an issue breakdown section for features that are `in-progress`. For each in-progress feature, read `issues-status.json` and append a list of issues with title + status.

Output shape for an in-progress feature:

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
  - Issues:
    - #01 Fix config aliases          [done]
    - #02 Version pinning audit       [done]
    - #03 I18n routing skeleton       [done]
    - #04 Local CMS foundation        [ready-for-agent]
    - #05 Contact form                [blocked]
```

Rules:
- Only show issue breakdown for features with `status: in-progress`
- For features that are `todo` or `archived`, show no issue breakdown — just the pipeline state
- If an in-progress feature has no `issues-status.json` or no issues, show `  - Issues: none`
- Each issue line: `    - #<id> <title>  [<status>]`
- Issues listed in ID order (ascending)

### Tests

Extend the `describe("status command")` block in `cli.test.ts`:

- In-progress feature with issues — breakdown shown with all issues
- In-progress feature with no issues — `Issues: none`
- Todo feature with issues — no breakdown shown
- Archived feature with issues — no breakdown shown
- Issue titles and statuses match `issues-status.json`

## Acceptance criteria

- [x] In-progress features show issue breakdown with `#<id> <title> [<status>]` format
- [x] Issues listed in ascending ID order
- [x] Todo and archived features show no issue breakdown
- [x] In-progress feature with no issues shows `Issues: none`
- [x] All tests pass

## Blocked by

- `03-status-command-milestones-and-pipeline` — builds on top of the status command


