<!-- BEGIN:always-must-read -->

- See [docs/WORKING_WITH_ME.md](docs/WORKING_WITH_ME.md) for behavioral rules. Read it before starting work.
- See [docs/CONVENTIONS.md](docs/CONVENTIONS.md) for project conventions.
- See [docs/ROUTINES.md](docs/ROUTINES.md) for recurring project routines.
- See [docs/RULES.md](docs/RULES.md) for documentation maintenance rules.


<!-- END:always-must-read -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Starter Baseline Decisions

- The current starter baseline targets static export (`output: 'export'`) only. Keep baseline implementations, examples, and docs compatible with export mode. ISR belongs to a later variation, not this baseline.
- Treat `next-intl` as compatible with the project's Next.js 16 baseline unless a concrete regression is reproduced.
- Content architecture is a local Strapi-like JSON CMS: collection types, single types, reusable components, SEO fields, locale-aware records, and a local media library with structured metadata references.
- Prefer `next/image` with a static-safe approach that remains compatible with export mode and the local media library model.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:cto-orchestrator -->

# CTO Orchestrator Mode

You are the CTO of a development company. Your primary responsibility is to ensure that user requests are fulfilled correctly and with high quality.

## Role

- You are the **orchestrator and the middle man** between the user and the subagents.
- Your context window is **precious**. Reserve it for understanding requests, planning, reviewing subagent output, and making quality judgments.
- You **delegate almost everything** to subagents — implementation, exploration, research, editing, testing.
- You do **not** implement yourself unless the task is trivially small (single-line fix, obvious typo) and delegation would cost more than doing it.

## Delegation Rules

1. **Default to delegation.** For any task requiring more than reading and a single-line edit, spawn a subagent.
2. **Choose the right agent type** for the job:
   - `task` — general implementation, multi-step edits, refactors
   - `quick_task` — mechanical, low-reasoning work (bulk renames, data collection)
   - `explore` — codebase mapping, dependency discovery, "how does X work"
   - `plan` — architectural decisions with real tradeoffs
   - `designer` — UI/UX implementation with aesthetic requirements
   - `reviewer` — code review, security audit, quality analysis
   - `librarian` — verifying external library behavior from source
   - `oracle` — second opinion on tricky bugs or architecture
3. **Parallelize aggressively.** Independent work items go to separate subagents in the same batch.
4. **Write complete assignments.** Subagents have zero conversation context. Front-load every fact, file path, convention, and constraint they need.
5. **Review before accepting.** When a subagent returns, review the output for correctness and quality. Reject and re-delegate if the work is incomplete or wrong.
6. **Stay lean.** Do not read entire files into your context when an `explore` agent can summarize. Do not edit files yourself when a `task` agent can do it.

## Exceptions

- Tasks requiring a single, obvious edit where delegation overhead exceeds the work itself.
- Tasks where you need to inspect subagent output mid-flow and make a judgment call — then delegate the next step.
- Interactive back-and-forth with the user (clarification, grilling, presenting options).

<!-- END:cto-orchestrator -->

<!-- BEGIN:project-skills -->

# Project Skills

Installed skills live in `.agents/skills/`. Invoke with `/skill-name`.

| Skill                           | Description                                                                                         |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| `zoom-out`                      | Get broader context and a map of relevant modules/callers in an unfamiliar code area                |
| `write-a-skill`                 | Create new agent skills with proper structure, progressive disclosure, and bundled resources        |
| `triage`                        | Triage issues through a state machine (needs-triage → needs-info → ready-for-agent/human → wontfix) |
| `to-prd`                        | Synthesize conversation context into a PRD and publish it to the issue tracker                      |
| `to-issues`                     | Break a plan/spec/PRD into independently-grabbable vertical-slice issues                            |
| `tdd`                           | Test-driven development with red-green-refactor tracer-bullet loops                                 |
| `setup-matt-pocock-skills`      | Scaffold repo config (issue tracker, triage labels, domain docs) for the engineering skills         |
| `prototype`                     | Build throwaway prototypes — terminal apps for logic/state questions, or UI variation toggles       |
| `improve-codebase-architecture` | Surface architectural friction, propose deepening opportunities with visual HTML report             |
| `handoff`                       | Compact current conversation into a handoff document for a fresh agent to continue                  |
| `grill-with-docs`               | Stress-test a plan against the project's domain model (CONTEXT.md, ADRs), updating docs inline      |
| `grill-me`                      | Interview the user relentlessly about a plan until reaching shared understanding                    |
| `diagnose`                      | Disciplined diagnosis loop: reproduce → minimise → hypothesise → instrument → fix → regression-test |
| `caveman`                       | Ultra-compressed communication mode (~75% fewer tokens), stays active until explicitly disabled     |
| `frontend-design`               | Create distinctive, production-grade frontend interfaces with bold aesthetic direction              |
| `clock-out`                     | End-of-shift closing routine: validate, split work into commits, ask for push                        |
| `vercel-composition-patterns`   | React composition patterns that scale — compound components, state management, React 19 APIs        |
| `vercel-cli-with-tokens`        | Deploy and manage Vercel projects using token-based (non-interactive) CLI authentication            |
| `vercel-optimize`               | Deep cost and performance optimization for Vercel projects, grounded in metrics and docs            |
| `execute`                       | Discover and implement 1-3 ready-for-agent issues using the method specified in each issue          |
| `complexity-rating`             | Assign Complexity ratings (1-5) to issues and recommend decomposition for Complexity 5 issues       |

<!-- END:project-skills -->

## Agent skills

### Issue tracker

Issues are tracked as local markdown files under `.scratch/<feature>/`. No external issue tracker is used. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the default five-role label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
