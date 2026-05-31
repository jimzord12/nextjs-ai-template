<!-- BEGIN:always-must-read -->

- See [docs/WORKING_WITH_ME.md](docs/WORKING_WITH_ME.md) for behavioral rules. Read it before starting work.
- See [docs/CONVENTIONS.md](docs/CONVENTIONS.md) for project conventions.
- See [docs/ROUTINES.md](docs/ROUTINES.md) for recurring project routines.
- See [docs/RULES.md](docs/RULES.md) for documentation maintenance rules.

This project keeps process diary records in `docs/diary/`. When work reaches approximately a day's worth of meaningful progress, create or update a diary record using `docs/templates/DIARY.template.md`.

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
| `clock-out`                     | End-of-shift closing routine: validate, split work into commits, write the diary, ask for push      |
| `vercel-composition-patterns`   | React composition patterns that scale — compound components, state management, React 19 APIs        |
| `vercel-cli-with-tokens`        | Deploy and manage Vercel projects using token-based (non-interactive) CLI authentication            |
| `vercel-optimize`               | Deep cost and performance optimization for Vercel projects, grounded in metrics and docs            |

<!-- END:project-skills -->
