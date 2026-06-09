# Plan: Skill Pipeline for Milestone-Driven Development

## Purpose

Build the end-to-end pipeline that takes a roadmap milestone to production code through structured, repeatable steps. Five skills, one extracted CLI tool, one unified convention.

---

## Context (Handoff)

### Project

Next.js AI Template — a multi-CMS marketing website template for agencies. See `ROADMAP.md` for V1 milestones (M1–M5) and V2 themes.

### Pipeline (the thing we're building)

```
milestone-to-briefs ──> grill-with-docs ──> to-prd ──> to-issues ──> do-issue
  (new)                  (calibrate)       (calibrate)  (calibrate)   (refine)
```

Each step produces artifacts at a predictable location:

```
.scratch/
├── features-status.json                          # managed by issues-manager CLI
├── features/
│   ├── 001-<slug>/
│   │   ├── BRIEF.md                              # step 1 output
│   │   ├── GRILL_SESSION.md                      # step 2 output
│   │   ├── PRD.md                                # step 3 output
│   │   └── issues/
│   │       ├── 001-<issue-slug>.md               # step 4 output
│   │       └── 002-<issue-slug>.md
│   ├── 002-<slug>/
│   │   ├── BRIEF.md
│   │   └── ...
```

### Key Files

| File | What it contains |
|------|-----------------|
| `CONTEXT.md` | Domain glossary (language, V1 scope). **Never duplicate here.** |
| `ROADMAP.md` | V1 milestones M1–M5, V2 themes. Source of truth for scope. |
| `.agents/skills/grill-with-docs/SKILL.md` | Current grilling skill — interactive interview, updates CONTEXT.md + ADRs inline |
| `.agents/skills/to-prd/SKILL.md` | Synthesizes session state → PRD + feature registry + feature briefs |
| `.agents/skills/to-prd/TEMPLATE.md` | PRD template, feature registry format, feature brief template |
| `.agents/skills/to-issues/SKILL.md` | Breaks plan into vertical-slice tracer-bullet issues |
| `.agents/skills/do-issue/SKILL.md` | Orchestrates issue implementation via subagents |
| `.agents/skills/do-issue/METHODS.md` | TDD and chore implementation workflows |
| `.agents/skills/do-issue/scripts/issues-manager-cli/` | CLI source (`cli.ts`, `features-state.ts`, `issues-state.ts`, `bin.ts`, tests) |
| `docs/templates/grilling/GRILLING-SESSION-STATE.template.md` | Decision tree template for session state |
| `docs/templates/grilling/GRILLING-SESSION-RESPONSE.template.md` | Per-branch Q&A template |
| `.agents/skills/grill-with-docs/CONTEXT-FORMAT.md` | CONTEXT.md glossary rules |
| `.agents/skills/grill-with-docs/ADR-FORMAT.md` | ADR format and when-to-create rules |
| `.scratch/AGENTS.md` | Response rules for `.scratch/` work (CEO-style, concise) |
| `.scratch/features-status.json` | Feature state: `{ id, slug, status, lastUpdated }`. Statuses: `todo | in-progress | archived` |

### Existing State

- `.scratch/` has two features: `production-template-baseline` (in-progress) and `issues-manager-cli` (archived/done). These use the **old** flat convention (`./scratch/<slug>/`). The pipeline must support the **new** convention (`./scratch/features/<index>-<slug>/`).
- The issues-manager CLI is referenced in `package.json` as `"issues-manager": "bun src/issues-manager-cli/bin.ts"` but `src/issues-manager-cli/` does not exist. The actual source lives inside the `do-issue` skill directory. This is broken.
- The CLI's `features-state.ts` hardcodes `.scratch/` as the base directory. It stores features flat: `.scratch/<slug>/`. It will need updating to support `.scratch/features/<index>-<slug>/`.

### Conventions

- Skill location: `.agents/skills/<skill-name>/SKILL.md` (with optional supporting files)
- Issue tracker: local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.
- Triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.
- Domain docs: single `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
- Feature delivery pipeline (existing docs): `docs/ROUTINES.md`.

---

## Tasks

### Task 1: Extract and Install Issues Manager CLI

**Why first:** The CLI is a dependency for `to-issues` (Task 5) and `do-issue` (Task 6). It's currently broken (`package.json` points to a nonexistent path).

**Current state:**
- Source: `.agents/skills/do-issue/scripts/issues-manager-cli/` (7 files: `bin.ts`, `cli.ts`, `cli.test.ts`, `features-state.ts`, `features-state.test.ts`, `issues-state.ts`, `issues-state.test.ts`)
- `package.json` script: `"issues-manager": "bun src/issues-manager-cli/bin.ts"` — path does not exist
- CLI stores features flat: `.scratch/<slug>/`. Needs update for `.scratch/features/<index>-<slug>/`.

**Steps:**

1. Move/copy CLI source from `.agents/skills/do-issue/scripts/issues-manager-cli/` to `scripts/issues-manager-cli/`
2. Update `package.json`: `"issues-manager": "bun scripts/issues-manager-cli/bin.ts"`
3. Update `features-state.ts` — change directory layout from `.scratch/<slug>/` to `.scratch/features/<index>-<slug>/`. The `getFeaturesStatusPath`, feature slug resolution, and issue file directory functions all need updating.
4. Update `issues-state.ts` — same directory convention change. `getIssuesStatusPath` and `getIssueFilesDir` must resolve to `.scratch/features/<index>-<slug>/issues/`.
5. Run existing tests to verify: `bun test scripts/issues-manager-cli/`
6. Update `do-issue/SKILL.md` to reference the new path
7. Remove the copy from `.agents/skills/do-issue/scripts/issues-manager-cli/` (skill references the project-level tool)

**Acceptance:**

- [ ] `pnpm issues-manager list-issues` works
- [ ] `pnpm issues-manager get-feature` works
- [ ] Tests pass: `bun test scripts/issues-manager-cli/`
- [ ] No duplicate CLI source — only `scripts/issues-manager-cli/`

---

### Task 2: Create `milestone-to-briefs` Skill

**Why:** Top of the pipeline. Takes a roadmap milestone and produces one or more feature briefs.

**Input:** A milestone from `ROADMAP.md` (e.g. "M1 — Foundation")

**Output:** One or more BRIEF.md files at `.scratch/features/<auto-index>-<slug>/BRIEF.md`

**Process:**

1. Read the milestone scope from `ROADMAP.md`
2. Audit the codebase to understand what already exists vs what the milestone requires
3. Identify the gap — list what's done, what's partial, what's missing
4. Decompose the milestone into features (horizontal infrastructure + vertical end-to-end slices)
5. For each feature, produce a `BRIEF.md` using the feature brief template from `.agents/skills/to-prd/TEMPLATE.md` (the Feature Brief Template section)
6. Register each feature in `.scratch/features-status.json` via the issues-manager CLI
7. Present the breakdown to the user for review before writing files

**Skill file:** `.agents/skills/milestone-to-briefs/SKILL.md`

**Acceptance:**

- [ ] Skill reads a milestone from ROADMAP.md and audits the codebase
- [ ] Produces BRIEF.md files at the correct location with auto-incremented index
- [ ] Registers features via issues-manager CLI
- [ ] BRIEF.md format matches the feature brief template from to-prd/TEMPLATE.md
- [ ] User is presented the breakdown for approval before files are written

---

### Task 3: Calibrate `grill-with-docs`

**Why:** Currently a standalone interview tool. Needs to know it operates on a feature brief and produces a grilling session artifact.

**What changes:**

The skill must be aware of the pipeline context:

1. **Input awareness:** When invoked with a feature brief path (or when the user says "grill this brief"), read the BRIEF.md from `.scratch/features/<id>-<slug>/BRIEF.md`
2. **Output location:** Write `GRILL_SESSION.md` to `.scratch/features/<id>-<slug>/GRILL_SESSION.md` using the `GRILLING-SESSION-STATE` template from `docs/templates/grilling/GRILLING-SESSION-STATE.template.md`
3. **Template usage:** Use the `GRILLING-SESSION-RESPONSE` template for each branch/response during the session. Link responses from the state file.
4. **Auto-update:** Update `GRILL_SESSION.md` on every resolved decision — don't batch
5. **Done condition:** The session is "done" when all decision tree leaves are resolved (no open leaves remain). Inform the user when the session is ready for `to-prd`.
6. **Existing behavior preserved:** Still updates CONTEXT.md glossary inline, still creates ADRs when the three conditions are met (hard to reverse, surprising, real trade-off). The skill already does this well.

**Files to modify:** `.agents/skills/grill-with-docs/SKILL.md`

**Acceptance:**

- [ ] Skill reads BRIEF.md as input
- [ ] Produces GRILL_SESSION.md at the feature directory using the state template
- [ ] Updates GRILL_SESSION.md on every decision
- [ ] Uses GRILLING-SESSION-RESPONSE template for branch writeups
- [ ] Signals when session is complete (all leaves resolved)
- [ ] Existing CONTEXT.md and ADR behavior unchanged

---

### Task 4: Calibrate `to-prd`

**Why:** Already designed to accept grilling session state as input. Needs path conventions aligned.

**What changes:**

1. **Input:** Read `GRILL_SESSION.md` from `.scratch/features/<id>-<slug>/GRILL_SESSION.md`
2. **Output:** Write `PRD.md` to `.scratch/features/<id>-<slug>/PRD.md`
3. **Template:** Use the existing PRD template at `.agents/skills/to-prd/TEMPLATE.md`
4. **Token optimization:** The PRD should be a refined, condensed version of the grilling session — not a copy. Resolve the decision tree into implementation decisions. Drop the Q&A format; keep only the conclusions.
5. **Feature registry:** The PRD's feature registry should reference features that already exist in `features-status.json` (created by `milestone-to-briefs`), not create new ones
6. **No feature brief generation:** Feature briefs were already created in step 1. The PRD's feature registry maps to those existing briefs. Do NOT regenerate briefs.

**Files to modify:** `.agents/skills/to-prd/SKILL.md`

**Acceptance:**

- [ ] Reads GRILL_SESSION.md as input
- [ ] Produces PRD.md at the feature directory
- [ ] PRD is token-optimized (conclusions, not raw session transcript)
- [ ] Feature registry references existing features from features-status.json
- [ ] Does not regenerate feature briefs

---

### Task 5: Calibrate `to-issues`

**Why:** Needs to use the issues-manager CLI, output to the new location, and produce issues with the correct frontmatter format.

**What changes:**

1. **Input:** Read `PRD.md` from `.scratch/features/<id>-<slug>/PRD.md`
2. **Output:** Write issues to `.scratch/features/<id>-<slug>/issues/<auto-index>-<issue-slug>.md`
3. **Issues-manager CLI:** Use `pnpm issues-manager` for state management instead of manual file manipulation
4. **Issue frontmatter:** Each issue must have the fields the CLI expects (see `issues-state.ts` → `parseIssueMarkdown`):
   - `Method:` — `tdd` or `chore`
   - `Status:` — `ready-for-agent` (default for new issues)
   - `Complexity:` — integer 1-5
   - `BlockedBy:` — comma-separated issue IDs or `none`
5. **Vertical slices:** Keep the existing tracer-bullet decomposition approach (thin end-to-end slices, not horizontal layers)
6. **User quiz:** Keep the existing review step — present breakdown, iterate until approved
7. **Dependency ordering:** Publish issues in dependency order so blockers get real IDs first

**Files to modify:** `.agents/skills/to-issues/SKILL.md`

**Acceptance:**

- [ ] Reads PRD.md as input
- [ ] Produces issues at `.scratch/features/<id>-<slug>/issues/` with auto-incremented filenames
- [ ] Each issue has Method, Status, Complexity, BlockedBy frontmatter
- [ ] Uses issues-manager CLI for state management
- [ ] Issues are vertical tracer-bullet slices
- [ ] User reviews breakdown before files are written

---

### Task 6: Refine `do-issue`

**Why:** The implementation phase. Needs TDD integration and harness-aware subagent delegation.

**What changes:**

1. **CLI path:** Reference `scripts/issues-manager-cli/` (project-level), not the old skill-internal path
2. **TDD workflow:** When `Method: tdd`, use the harness's built-in TDD discipline:
   - Write failing test first (red)
   - Implement minimum to pass (green)
   - Refactor
   - Verify with `pnpm test`
3. **Subagent delegation:** Use the harness's `task` tool for implementation. The orchestrator (CTO agent) should NOT write code — only delegate and judge.
4. **Judgment criteria:** When reviewing subagent output, check:
   - Every acceptance criterion has evidence
   - The correct method was followed (TDD or chore)
   - Code matches existing style/conventions (see `docs/CONVENTIONS.md`)
   - No untested branches, no hardcoded values, no obvious gaps
5. **Re-delegation:** If output is incomplete, re-delegate with sharper instructions — do NOT fix it yourself
6. **Verification:** After subagent completes, run `pnpm test` + `pnpm build` (or equivalent)
7. **Issue closure:** Mark done via CLI, check off acceptance criteria in the issue file

**Files to modify:** `.agents/skills/do-issue/SKILL.md`, `.agents/skills/do-issue/METHODS.md`

**Acceptance:**

- [ ] References project-level CLI at `scripts/issues-manager-cli/`
- [ ] TDD method follows red-green-refactor
- [ ] Orchestrator delegates all code to subagents, never writes code itself
- [ ] Verification runs `pnpm test` + build after each issue
- [ ] Re-delegates on incomplete output rather than self-fixing
- [ ] Closes issues via CLI with acceptance criteria checked off

---

## Execution Order

```
Task 1 (extract CLI)        ← no dependencies, unblocks 5 and 6
Task 2 (milestone-to-briefs) ← no dependencies, new skill
Task 3 (calibrate grill)     ← no dependencies
Task 4 (calibrate to-prd)    ← no dependencies
Task 5 (calibrate to-issues) ← depends on Task 1
Task 6 (refine do-issue)     ← depends on Task 1
```

Tasks 1–4 can run in parallel. Tasks 5–6 wait for Task 1.

## Post-Completion Validation

After all 6 tasks are done, validate the pipeline end-to-end:

1. Run `milestone-to-briefs` against M1 from ROADMAP.md → expect BRIEF.md files created
2. Run `grill-with-docs` against one BRIEF.md → expect GRILL_SESSION.md created
3. Run `to-prd` against the GRILL_SESSION.md → expect PRD.md created
4. Run `to-issues` against the PRD.md → expect issue files created
5. Run `do-issue` to pick up an issue → expect implementation via subagent, tests pass, issue closed

If any step fails, the pipeline is not done.
