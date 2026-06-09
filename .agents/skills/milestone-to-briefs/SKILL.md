---
name: milestone-to-briefs
description: Read a milestone from ROADMAP.md, audit the codebase, decompose into feature briefs, and register them. Use when user says 'decompose milestone', 'create briefs', 'break down M1', or wants to start the pipeline from a roadmap milestone.
---

# milestone-to-briefs

The top of the pipeline. Takes a roadmap milestone, audits the codebase against its scope, identifies the gap, decomposes into feature briefs, and registers them.

## Input

A milestone identifier from `ROADMAP.md` — e.g. `M1`, `M2`, or the full heading `M1 — Foundation`.

## Output

- One `BRIEF.md` per feature at `.scratch/features/<NNN>-<slug>/BRIEF.md`
- Each feature registered in `.scratch/features-status.json`

## Process

### 1. Read the milestone scope

Parse `ROADMAP.md` and extract the full scope block for the target milestone — the quoted scope items and the "Done when" checklist.

### 2. Audit the codebase

Explore the repo to understand what already exists versus what the milestone requires. Check:

- Source directories for implemented features
- Existing configuration files (`next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, etc.)
- Content model files under `src/content/`
- Components under `src/components/`
- Routes under `src/app/`
- Test infrastructure (`vitest.config.ts`, test files)
- Tooling config (linters, formatters, git hooks)
- Existing ADRs in `docs/adr/`
- `CONTEXT.md` for established domain vocabulary

Use `search`, `find`, and targeted `read` — not full-file reads of everything.

### 3. Identify the gap

Produce a structured assessment:

- **Done**: fully implemented and working
- **Partial**: exists but incomplete, wrong, or needs rework
- **Missing**: not present at all

Map each scope item to its status. Be honest — don't inflate progress.

### 4. Decompose into features

Break the milestone into features using two categories:

- **Horizontal** (infrastructure): things other features depend on — adapter interfaces, theme systems, build tooling, shared utilities
- **Vertical** (end-to-end slices): demoable features that cut through all layers

Rules:
- Horizontal features come first (lower phase numbers)
- Dependencies point to other feature slugs in the same milestone
- Each feature is independently implementable once its dependencies are done
- Prefer many thin features over few thick ones
- Feature slugs are kebab-case, concise, and descriptive

### 5. Present the breakdown for review

Before writing any files, present a summary table to the user:

| # | Slug | Type | Phase | Dependencies | Description |
|---|------|------|-------|-------------|-------------|
| 1 | `example-slug` | horizontal | 1 | none | What it includes |

Also include the gap assessment (done / partial / missing).

**Wait for user approval.** Iterate on the breakdown until the user approves. Do not proceed to step 6 without explicit approval.

### 6. Write BRIEF.md files and register features

For each approved feature, in order:

#### a. Allocate an ID

Read `.scratch/features-status.json`. Use the current `nextFeatureId` value, then increment it.

#### b. Create the feature directory and BRIEF

Create `.scratch/features/<NNN>-<slug>/BRIEF.md` where `<NNN>` is the 3-digit zero-padded ID.

The BRIEF.md must follow the Feature Brief Template from `.agents/skills/to-prd/TEMPLATE.md`:

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

#### c. Register in features-status.json

Add the feature entry to the `features` array:

```json
{
  "id": <NNN>,
  "slug": "<slug>",
  "status": "todo",
  "lastUpdated": "<ISO 8601 timestamp>",
  "finalStatus": null
}
```

Update `nextFeatureId` to `<NNN + 1>`.

#### d. Activate via CLI

```bash
pnpm issues-manager update-feature <slug> --status todo
```

### 7. Confirm

After all features are registered, present the final list:

- Feature directory paths created
- Features-status.json updated
- CLI activation confirmed
- Suggested next step: run `/grill-with-docs` on the first feature to start the pipeline

## Important

- Read `CONTEXT.md` for domain vocabulary — use it consistently throughout all briefs
- Respect existing ADRs in `docs/adr/` — briefs must not contradict them
- The feature brief format is fixed — match the template exactly
- Feature IDs are 3-digit zero-padded: `001`, `002`, etc.
- User approval is mandatory before any files are written or features registered
- This skill produces briefs, not PRDs — `/to-prd` comes after `/grill-with-docs`
- If the milestone scope is ambiguous, ask the user before decomposing
