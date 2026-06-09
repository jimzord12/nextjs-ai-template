---
name: to-issues
description: Break a PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices. Use when user wants to convert a plan into issues, create implementation tickets, or break down work into issues.
---

# To Issues

Break a PRD into independently-grabbable issues using vertical slices (tracer bullets).

## Input

Read the PRD from `.scratch/features/<id>-<slug>/PRD.md`. Determine the current feature by running:

```
pnpm features-cli get-feature
```

This returns the active feature's id, slug, and status. All issues are written to that feature's directory.

## Output

Write each issue file to:

```
.scratch/features/<id>-<slug>/issues/<auto-index>-<issue-slug>.md
```

- `<auto-index>` — zero-padded sequential number (01, 02, 03…) determined by the order you write the files.
- `<issue-slug>` — lowercase kebab-case, derived from the issue title.

After writing all issue files, run:

```
pnpm features-cli list-issues
```

to verify the CLI picked them up correctly and regenerated `issues-status.json`.

## CLI Integration

All issue state management is handled through `pnpm features-cli`. NEVER manually edit `issues-status.json`.

Available commands:

| Command | Purpose |
|---|---|
| `pnpm features-cli get-feature` | Show current feature id, slug, status |
| `pnpm features-cli list-issues` | List all issues for the current feature |
| `pnpm features-cli get-issue --next` | Show the next actionable unblocked issue |
| `pnpm features-cli update-status <id> --status <status>` | Transition an issue's status |
| `pnpm features-cli update-blockers <id> --blockers <none\|id[,id...]>` | Set blocker references |
| `pnpm features-cli update-feature <slug> --status <status>` | Update feature status (todo, in-progress, archived) |

## Issue Frontmatter Format

Every issue file must begin with header metadata lines, followed by a blank line, then an H1 title. The format is `Key: Value` — NOT YAML frontmatter fences.

Required fields:

- **Method** — `tdd`, `chore`, or `scaffold` (any non-empty string describing the workflow)
- **Status** — `ready-for-agent` (default for new issues), `needs-triage`, `needs-info`, `ready-for-human`, `in-progress`, `done`, `wontfix`
- **Complexity** — positive integer 1–5
- **BlockedBy** — `none` or comma-separated issue IDs (e.g., `3` or `2, 5`)

Example:

```
Method: tdd
Status: ready-for-agent
Complexity: 3
BlockedBy: none

# Issue Title Here
```

Another example with blockers:

```
Method: chore
Status: ready-for-agent
Complexity: 2
BlockedBy: 3, 7

# Follow-Up Issue Title
```

## Process

### 1. Gather context

Run `pnpm features-cli get-feature` to identify the active feature. Read the PRD from `.scratch/features/<id>-<slug>/PRD.md`.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Issue titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

### 3. Draft vertical slices

Break the PRD into **tracer bullet** issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

Slices may be 'HITL' or 'AFK'. HITL slices require human interaction, such as an architectural decision or a design review. AFK slices can be implemented and merged without human interaction. Prefer AFK over HITL where possible.

<vertical-slice-rules>
- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones
</vertical-slice-rules>

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: HITL / AFK
- **Complexity**: 1–5
- **Method**: tdd / chore / scaffold
- **Blocked by**: which other slices (if any) must complete first
- **User stories covered**: which user stories this addresses (if the source material has them)

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the correct slices marked as HITL and AFK?

Iterate until the user approves the breakdown.

### 5. Write issue files in dependency order

Write issue files **in dependency order** (blockers first) so that blocker issues get real IDs before dependent issues reference them. The file name determines the issue ID — the numeric prefix is the ID.

For example, write these files in this order:
1. `01-foundation.md` (BlockedBy: none)
2. `02-consumer-a.md` (BlockedBy: 1)
3. `03-consumer-b.md` (BlockedBy: 1)
4. `04-integration.md` (BlockedBy: 2, 3)

Use the issue template below for the file body.

### 6. Verify with the CLI

After writing all issue files, run:

```
pnpm features-cli list-issues
```

Verify that:
- All issues appear with correct IDs, titles, methods, complexities, and blocker references.
- No parse errors are reported.

If issues need blocker adjustments, use:

```
pnpm features-cli update-blockers <id> --blockers <none|id[,id...]>
```

<issue-template>
Method: <tdd|chore|scaffold>
Status: ready-for-agent
Complexity: <1-5>
BlockedBy: <none|id[,id...]>

# <Issue Title>

## Parent

PRD: `.scratch/features/<id>-<slug>/PRD.md`

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation.

Avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it here and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- `<id>-<slug-of-blocker>` — reason for dependency

Or "None — can start immediately" if no blockers.
</issue-template>

Do NOT close or modify any parent issue or PRD.
