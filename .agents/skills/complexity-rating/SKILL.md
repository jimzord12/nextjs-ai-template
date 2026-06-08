---
name: complexity-rating
description: Assign Complexity ratings (1-5) to issues in a directory and recommend decomposition for Complexity 5 issues. Use when user wants to rate issue complexity, assess backlog difficulty, prioritize issues by effort, or decompose complex issues into smaller slices.
---

# Complexity Rating

Assign a `Complexity: X` rating (1-5) to every issue in a directory. For Complexity 5 issues, propose a concrete decomposition into smaller slices.

## Complexity Scale

| Rating | Meaning |
|--------|---------|
| 1 | Trivial — minutes of work, no decisions |
| 2 | Straightforward — single file or pattern, clear path |
| 3 | Moderate — multiple files, some design decisions, still single-session |
| 4 | Hard — agent can barely finish in one session, touches many subsystems |
| 5 | Decompose — too large or ambiguous for a single session, must be split |

See [RUBRIC.md](RUBRIC.md) for the full heuristic guide with concrete signals.

## Process

### 1. Gather the issues

Ask the user for the directory path containing issue files. If not provided, scan `.scratch/*/issues/` and let the user pick.

Read every `.md` file in the directory. Skip files that are not issues (no `# Title` heading or no acceptance criteria).

### 2. Rate each issue

For each issue, read the full body and evaluate against the rubric in [RUBRIC.md](RUBRIC.md). Consider:

- **Scope breadth**: How many files, modules, or subsystems does it touch?
- **Decision density**: How many non-obvious design choices are required?
- **Integration depth**: Does it cut through all layers (schema → API → UI → tests) or just one?
- **Ambiguity**: How much is left unspecified? Would the agent need to ask questions mid-work?
- **Risk of rework**: Could mid-session discoveries invalidate earlier work?

Produce a summary table:

```
| Issue | Title | Complexity | Key signals |
|-------|-------|-----------|-------------|
| 01-fix-config.md | Fix Config Aliases | 2 | Single subsystem, clear fix |
| 07-hotel-rooms.md | Hotel Rooms | 4 | 14 ACs, 4 subsystems, i18n |
```

Present this to the user for review. Ask:
- Does any rating feel wrong?
- Any context not captured in the issue text that would change the rating?

### 3. Write the ratings

For each issue, add a `Complexity: X` line near the top of the file, alongside existing `Status:` and `Method:` lines. If a `Complexity:` line already exists, update it.

Format:
```markdown
Status: ready-for-agent
Method: tdd
Complexity: 3

# Issue Title
```

### 4. Decompose Complexity 5 issues

For every issue rated 5, produce a decomposition proposal:

1. **Explain why it's a 5** — list the specific signals (too many ACs, spans incompatible subsystems, high ambiguity, etc.)
2. **Propose 2-5 sub-issues** — each should be Complexity 1-3. Use vertical slices where possible. Give each:
   - Title
   - What to build (1-3 sentences)
   - Acceptance criteria
   - Blocked by (which sub-issues)
   - Estimated complexity
3. **Show the dependency graph** — textual, e.g. `A → B → C, A → D`
4. **Ask the user** whether to publish the sub-issues to the issue tracker

### Decomposition template

```markdown
## Decomposition of <issue-title>

**Why it's a 5**: <reasoning>

### Proposed sub-issues

#### <NN-a>-<slug>.md — <title> (Complexity: 2)
**What to build**: <description>
**Acceptance criteria**:
- [ ] ...
**Blocked by**: None

#### <NN-b>-<slug>.md — <title> (Complexity: 3)
**What to build**: <description>
**Acceptance criteria**:
- [ ] ...
**Blocked by**: <NN-a>

### Dependency graph

<NN-a> → <NN-b> → <NN-c>
             ↘ <NN-d>
```

If the user approves, publish the sub-issues and update the original issue's body with a `Decomposed into:` line listing the sub-issue filenames.
