---
name: do-issue
description: Discover and implement 1-3 ready-for-agent issues using the Features CLI. Use when user says "do an issue", "pick up next issue", "implement issues", "what's next", "work on backlog", "execute issues", or asks to implement ready-for-agent issues from .scratch/.
---

# do-issue

Orchestrate implementation of `ready-for-agent` issues from `.scratch/features/<index>-<slug>/issues/`.

Uses the project-level Features CLI at `scripts/Features CLI/` (run via `pnpm features-cli <command>`) to scan, select, and update issue state. Delegates all implementation to subagents — the orchestrator never writes production code.

## Issues Manager CLI

The CLI lives at `scripts/Features CLI/` in the project root. Run via:

```
pnpm features-cli <command>
```

### Commands

| Command | Flags | Description |
|---------|-------|-------------|
| `list-issues` | `[--feature <slug>]` `[--actionable]` | List issues for current or specified feature. `--actionable` filters to ready-for-agent with all blockers resolved. |
| `get-feature` | | Show current active feature (the single in-progress one). |
| `update-feature <slug>` | `--status <todo\|in-progress\|archived>` | Activate or deactivate a feature. Only one feature can be in-progress at a time. |
| `get-issue --next` | `[--feature <slug>]` | Deterministic next-issue: lowest complexity, then lowest ID, among actionable ready-for-agent issues. |
| `update-status <id>` | `--status <status>` `[--feature <slug>]` `[--force]` | Transition issue status. Enforces state machine unless `--force`. Regenerates derived state and refreshes timestamps. |
| `update-blockers <id>` | `--blockers <none\|id[,id...]>` `[--feature <slug>]` | Update issue blockers. Normalizes legacy prose blockers to canonical `BlockedBy:` header. |

### Status State Machine

```
needs-triage → needs-info → ready-for-agent → in-progress → done
                     ↓              ↓                ↓
                 wontfix        wontfix          wontfix
                                    ↓
                             ready-for-human
```

`--force` bypasses transition guards. Use sparingly and only with user approval.

### Issue File Requirements

Each issue in `.scratch/features/<id>-<slug>/issues/` must have these frontmatter fields:

- **`Method:`** — `tdd` or `chore` (see [METHODS.md](METHODS.md))
- **`Status:`** — current state in the state machine
- **`Complexity:`** — integer 1–5 effort gauge

**CRITICAL**: If any field is missing, the issue cannot be processed. Abort and tell the user which field(s) are missing.

## Orchestration Principles

You are the **orchestrator, not the implementer**. Your job is to:

1. **Scan** — find ready issues, present them to the user
2. **Select** — user picks 1-3 issues
3. **Load context** — read the issue, PRD, domain docs, and codebase area
4. **Delegate** — hand implementation to a subagent with everything it needs
5. **Judge** — review the subagent's output for correctness and completeness
6. **Verify** — run tests and build
7. **Close** — mark the issue done, check off acceptance criteria
8. **Report** — summarise results

**You MUST NOT implement code yourself.** Every line of production code, test code, or configuration must be written by a subagent. You may read files to build context for delegation, but you never edit files directly (except issue markdown status updates in step 7). **Never write code yourself — always delegate via a `task` subagent.**

If a subagent's output is incomplete or incorrect, **re-delegate with sharper instructions — do NOT fix it yourself.**

## Workflow

### 1. Scan for ready issues

```bash
pnpm features-cli list-issues --actionable
```

If no actionable issues exist, run `pnpm features-cli list-issues` to see all issues. If nothing is `ready-for-agent` at all, suggest `/triage` or `/to-issues` to create or triage issues.

Present a numbered table:

| # | ID | Issue | Feature | Complexity | Blocked by |
|---|----|-------|---------|------------|------------|

Also run `pnpm features-cli get-issue --next` to highlight the recommended pick (lowest complexity, then lowest ID).

### 2. User picks 1–3

Ask the user to pick 1–3 issues by number. Warn if:

- Any picked issue has unresolved blockers (show which)
- Multiple picked issues touch overlapping files (they'll run sequentially)

### 3. Load context

For each picked issue, read:

- The full issue file (body, acceptance criteria, blocked-by)
- The parent PRD if referenced under `## Parent`
- `CONTEXT.md` and applicable ADRs in `docs/adr/` for the area the issue touches
- The codebase area the issue modifies — explore before delegating

Use the project's domain glossary from `CONTEXT.md` throughout.

Build a **delegation brief** for each issue containing:

- The issue body and all acceptance criteria
- The method to follow (from `Method:` field — see [METHODS.md](METHODS.md))
- The relevant domain context (terms, conventions, constraints)
- The files and modules the subagent will need to touch
- Any dependencies on other issues or external state

### 4. Delegate implementation

Spawn one subagent per issue. Use the `task` agent type for all implementation work.

- **Independent issues** (no shared files) → spawn in parallel in a single `task` batch
- **Overlapping issues** → spawn sequentially, completing one fully before delegating the next

Each subagent assignment MUST include:

- The full delegation brief from step 3
- The method workflow to follow (TDD or chore — copy the relevant section from [METHODS.md](METHODS.md))
- Explicit instruction to **skip all gates, linters, and formatters** (the orchestrator runs those once at the end)
- The acceptance criteria as a verifiable checklist
- Any file paths, conventions, or constraints discovered during context loading

**TDD emphasis**: When the method is `tdd`, the subagent MUST follow strict red-green-refactor:
1. **RED** — Write a failing test FIRST that defines the expected behavior
2. **GREEN** — Implement the minimum code required to make the test pass
3. **REFACTOR** — Clean up the code while keeping tests green
4. **VERIFY** — Run `pnpm test` to confirm everything passes

The subagent must not write implementation code before a failing test exists.

### 5. Judge output

When a subagent returns, review its output critically against these checks:

- **Acceptance criteria**: Does every acceptance criterion have evidence of being met?
- **Method fidelity**: Did the subagent follow the correct method? For TDD — strict red-green-refactor with tests written first. For chore — direct implementation without unnecessary ceremony.
- **Style and conventions**: Does the code match the project's existing style and conventions? (See `docs/CONVENTIONS.md`.)
- **Coverage gaps**: Are there untested branches, missing error handling, hardcoded values, or obvious gaps?

**If the output is incomplete or incorrect:** re-delegate to a new subagent with a sharper brief that calls out exactly what was wrong. **Do NOT fix it yourself — re-delegation is the only acceptable response to incomplete work.**

**If the output is acceptable:** proceed to step 6.

### 6. Verify

After all subagents complete and pass judgment, run verification yourself:

- `pnpm test` — all tests must pass
- `pnpm build` — project must build successfully

If anything fails, re-delegate to a subagent with specific instructions about what broke. Do NOT fix it yourself.

### 7. Mark done

For each completed issue:

```bash
pnpm features-cli update-status <id> --status done
```

Then open the issue markdown file and check off completed acceptance criteria: `[ ]` → `[x]`.

Leave unchecked any criteria that could not be met, with a note explaining why.

### 8. Report

After all picked issues are done, summarise:

- What was implemented (per issue)
- Tests added or modified
- Acceptance criteria met vs. unmet (with reasons)
- Build and test results
