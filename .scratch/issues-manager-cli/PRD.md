# PRD - Issues Manager CLI

## Problem Statement

The local `.scratch/` issue-tracker workflow already gives the project a lightweight, Markdown-first way to define features, PRDs, and implementation issues. The gap is that routine issue-management work is still manual: an agent must inspect feature state, find the current feature, scan issue metadata, interpret blockers, and decide what is actionable. That manual loop is slow, repetitive, and easy to get wrong when derived JSON is stale, blocker notation is inconsistent, or feature focus is ambiguous.

From the user's perspective, the problem is not the lack of an issue tracker. The problem is the lack of a dependable operator for the existing tracker. They need a small TypeScript CLI that helps with scanning, selecting, and updating issues inside the current `.scratch/` workflow without becoming a smart workflow engine that hides state or makes autonomous decisions.

## Solution

Deliver a fail-fast, text-first TypeScript CLI that operates on the existing local Markdown issue-tracker model and its companion JSON read models. The CLI should remain intentionally dumb: it validates the tracker state, reads the current feature, derives actionable issues deterministically, updates canonical issue metadata explicitly, and regenerates derived JSON in the same write flow.

From the user's perspective, this means they can ask the tool what the current feature is, list actionable issues, deterministically fetch the next issue, and make explicit issue or feature updates without manually walking the tracker every time. The CLI should amplify the existing workflow rather than replace it, preserve Markdown as the canonical source for issue workflow, and stop immediately with descriptive errors whenever the repo state is invalid or ambiguous.

## User Stories

1. As an agent working in the local issue tracker, I want the CLI to validate tracker state before doing work, so that I do not act on malformed or incomplete workflow data.
2. As an agent, I want the CLI to reuse the project's existing triage vocabulary, so that issue workflow stays aligned with the repo's current conventions.
3. As an agent, I want the CLI to derive the current feature from feature workflow state, so that focus is explicit and not duplicated in a second pointer.
4. As an agent, I want commands that rely on the current feature to fail when there is no active feature, so that I do not silently operate on the wrong scope.
5. As an agent, I want commands that rely on the current feature to fail when more than one feature is marked `in-progress`, so that ambiguous workflow state is surfaced immediately.
6. As an agent, I want `list-issues` to show all issues for the current feature by default, so that I can understand the full state of the feature without opening each file manually.
7. As an agent, I want `list-issues --actionable` to filter to actionable work, so that I can see what is actually ready to be taken next.
8. As an agent, I want `get-issue --next` to return the deterministic next issue, so that issue selection is repeatable and does not depend on personal judgment.
9. As an agent, I want `get-issue --next` to distinguish between `empty`, `complete`, and `no-actionable`, so that I know whether the feature has no work, finished work, or blocked work.
10. As an agent, I want `complete` to be treated as a successful terminal result, so that the CLI can report a finished feature without pretending it is an error.
11. As an agent, I want `no-actionable` to remain a non-zero no-winner result, so that blocked or not-ready work is obvious in automation.
12. As an agent, I want command output to be self-contained human-readable text, so that I can paste it into chat or reason about it without decoding JSON.
13. As an agent, I want the CLI to avoid a public `--json` contract in v1, so that the tool stays simple and the public surface does not harden too early.
14. As an agent, I want explicit feature targeting on read commands, so that I can inspect a feature without first changing the active one.
15. As an agent, I want explicit feature targeting to work regardless of that feature's workflow status, so that research and review are not blocked by focus state.
16. As an agent, I want issue selection to ignore blocked issues automatically, so that the next-issue result always reflects truly actionable work.
17. As an agent, I want blockers to be defined in one canonical field, so that blocker logic is parseable and not hidden in prose.
18. As an agent, I want `BlockedBy: none` to be explicit on normalized issues, so that absence of blockers is represented consistently.
19. As an agent, I want blocker references validated against issues in the same feature, so that invalid cross-feature or missing dependencies are caught immediately.
20. As an agent, I want self-dependencies and duplicate blocker IDs rejected, so that blocker graphs stay meaningful.
21. As an agent, I want blockedness to be derived from unresolved blockers rather than encoded as a separate status, so that status vocabulary stays aligned with the tracker.
22. As an agent, I want downstream issues to unblock only when blocker issues reach `done`, so that `wontfix` does not silently reopen work.
23. As an agent, I want `update-issue` to update canonical issue Markdown and regenerate derived issue JSON in the same command, so that write flows do not leave the tracker in a half-updated state.
24. As an agent, I want issue updates to refresh both issue and feature `lastUpdated` timestamps, so that recent workflow activity is visible in derived state.
25. As an agent, I want `update-status` to enforce a transition graph by default, so that routine issue changes follow agreed workflow rules.
26. As an agent, I want a `--force` escape hatch on status updates, so that I can recover from exceptional cases without editing files by hand.
27. As an agent, I want `--force` to bypass only transition-graph checks, so that invalid structure and invalid vocabulary are still rejected.
28. As an agent, I want `update-blockers` to normalize a legacy issue when explicit blocker data is supplied, so that migration happens only during intentional writes.
29. As an agent, I want blocker-aware commands to fail on legacy prose-only blockers, so that hidden ambiguity is surfaced instead of silently guessed.
30. As an agent, I want the CLI to keep `issues-status.json` derived and regenerable, so that Markdown remains the source of truth for issue workflow.
31. As an agent, I want `features-status.json` to remain canonical for feature identity and workflow state, so that feature coordination lives in one root control file.
32. As an agent, I want the current feature to be the single feature marked `in-progress`, so that feature activation is visible in the existing workflow model.
33. As an agent, I want `update-feature` to fail if another feature is already `in-progress`, so that feature switching stays explicit and deliberate.
34. As an agent, I want active-feature switching to require a two-step workflow, so that the CLI never auto-demotes another feature behind my back.
35. As an agent, I want `list-issues` and `get-issue --next` results to include current feature metadata and the relevant issue paths, so that the output is directly actionable.
36. As an agent, I want deterministic selection to sort actionable issues by complexity ascending and then issue ID ascending, so that the next issue is stable and easy to predict.
37. As an agent, I want the CLI to stay more dumb than smart, so that it supports the agent's judgment rather than replacing it with hidden policy.
38. As a maintainer, I want write commands to regenerate derived data immediately, so that read commands can rely on a fast, consistent read model.
39. As a maintainer, I want normalization errors to be descriptive, so that contributors can fix malformed tracker files without reverse-engineering the parser.
40. As a maintainer, I want the tool to preserve compatibility with existing numbered issue filenames and top-of-file metadata, so that the CLI can adopt the current tracker rather than forcing a redesign.
41. As a maintainer, I want the CLI to expose a minimal v1 command surface, so that the project gets a viable workflow tool without scope creep into broad admin operations.
42. As a maintainer, I want tests to cover parsing, selection, transition, normalization, and stdout-facing command behavior, so that the public workflow contract is protected while implementation stays flexible.
43. As a future contributor, I want the CLI to fail fast on inconsistent feature or issue state, so that invalid repo state is corrected explicitly instead of being papered over.
44. As a future contributor, I want module-level logic to carry any structured internal data contracts, so that the CLI can stay text-first while tests still assert precise behavior.
45. As a future contributor, I want the CLI to remain compatible with the existing `to-prd` and `to-issues` skill outputs, so that planning and implementation skills continue to work on the same tracker.

## Implementation Decisions

- The product is a TypeScript CLI focused on issue scanning, deterministic issue selection, and explicit workflow updates inside the existing local Markdown issue tracker.
- The CLI preserves the existing split of canonical data: feature identity and feature workflow remain canonical in the root feature-status model, while issue workflow and issue metadata remain canonical in issue Markdown.
- The per-feature issue-status JSON is a derived read model. The tool regenerates it from canonical issue files rather than treating it as an independent source of truth.
- The current feature is not stored through a separate focus pointer. It is derived from the single feature whose workflow status is `in-progress`.
- Commands that depend on implicit current-feature resolution must fail immediately when there are zero or multiple `in-progress` features.
- The initial command surface for v1 should cover the core workflow only: feature inspection/update, issue listing, deterministic next-issue selection, issue status updates, and blocker updates.
- Read commands should support optional explicit feature targeting so operators can inspect any existing feature without changing the active feature.
- The no-winner contract for deterministic issue selection is compact and explicit. The command distinguishes `empty`, `complete`, and `no-actionable` rather than flattening all non-selection outcomes into one response.
- The deterministic winner rule is fixed in v1: filter to unblocked `ready-for-agent` issues, sort by complexity ascending and then issue ID ascending, and return the first result.
- The public CLI contract is text-first and stdout-only. Human-readable self-contained output is the default interface, and public JSON output is intentionally omitted in v1.
- If structured payloads are needed for tests or internal composition, they should exist at the module layer rather than as a public CLI output format.
- The issue metadata contract reuses the repo's existing workflow vocabulary and canonical top-of-file fields, including status, method, and complexity.
- The blocker model is consolidated into a single canonical header field. The canonical shapes are `BlockedBy: none` when no blockers exist and `BlockedBy: <id list>` when blockers exist.
- Blocker references are restricted to issue IDs within the same feature. Cross-feature blocker references are invalid in v1.
- Blockedness is derived from unresolved blocker references rather than stored as an explicit workflow status.
- Downstream issues unblock only when referenced blockers reach `done`. A `wontfix` blocker does not auto-unblock dependent work.
- Legacy prose-only blocker sections are not supported by blocker-aware commands. Those commands should fail with clear normalization guidance instead of guessing.
- There is no dedicated normalization command in v1. Normalization is allowed only as a side effect of intentional write flows, specifically blocker updates.
- Issue update commands must update canonical Markdown and regenerate the derived issue-status read model in the same operation.
- Status updates enforce a transition graph by default. A force path exists only for transition-graph bypass, not for structural or vocabulary validation bypass.
- Write flows also refresh issue-level and feature-level last-updated metadata so the derived state reflects recent operator activity.
- The feature workflow surface stays intentionally narrow. Feature updates exist because issue commands depend on an explicit current-feature model, not because the CLI is meant to become a general feature-administration tool.
- The CLI should remain fail-fast, explicit, and unsurprising. It should not auto-repair invalid tracker state, infer missing relationships, or silently rewrite ambiguous data.
- The CLI should preserve compatibility with existing feature directories, numbered issue filenames, Markdown PRDs, and the current skills-driven planning workflow.

## Testing Decisions

- A good test asserts external behavior, not implementation details. Tests should care about parsed results, selection outcomes, exit behavior, and stdout-facing output rather than the internal helper structure used to produce them.
- The highest-value seam is focused module testing around the behavior-rich domain logic. The parser, selector, transition, blocker-validation, and normalization rules should live behind testable modules with deterministic inputs and outputs.
- A thin layer of CLI smoke tests should verify the real command contract: stdout-facing text, exit-code behavior, feature-resolution failures, and representative command flows for `list-issues`, `get-issue --next`, and update commands.
- The balanced seam from the grilling session should be preserved. Most rule coverage belongs in focused domain tests, while only a small number of command-level tests protect the actual shell-facing interface.
- Module-level tests should cover feature-state validation, current-feature resolution, issue metadata parsing, blocker normalization, actionable filtering, deterministic selection ordering, and status-transition enforcement.
- Write-flow tests should cover Markdown updates plus derived JSON regeneration in the same operation, including `lastUpdated` refresh behavior at both issue and feature levels.
- Negative-path tests should cover malformed feature state, malformed issue state, invalid blocker references, duplicate blockers, self-dependencies, ambiguous current-feature state, and legacy prose-only blocker sections.
- `get-issue --next` tests should verify the distinct no-winner outcomes `empty`, `complete`, and `no-actionable`, including the success vs non-zero behavior split.
- `update-status` tests should verify both the default transition graph and the constrained `--force` escape hatch, proving that structure and vocabulary validation still apply under force.
- `update-blockers` tests should verify that normalization is allowed only when the operator supplies explicit canonical blocker data, and that feature-wide regeneration fails when non-normalized issue files remain.
- Prior art for the testing harness already exists in the repo's current Vitest setup and its existing component test. That setup should be reused for domain and CLI-adjacent tests rather than inventing a separate runner.
- The CLI smoke layer should stay intentionally small to avoid brittle fixture-heavy tests. The public contract should be protected, but detailed rule combinations belong below the shell layer.

## Out of Scope

- A public `--json` output contract in v1.
- Cross-feature blocker references.
- Automatic repair of malformed feature or issue state.
- Automatic demotion of an already active feature when another feature is promoted to `in-progress`.
- A one-command force switch for the active feature.
- A dedicated normalization command for legacy blocker prose.
- Broad feature administration or maintenance utilities beyond the minimum workflow surface.
- Smart recommendation systems, heuristic issue prioritization, or inference-heavy workflow automation.
- Replacing Markdown issue files as the canonical issue workflow source.
- Making PRD Markdown the canonical source of feature identity.
- Changing or extending the external `to-prd` skill contract.

## Further Notes

- The intent is to build a tool that makes the current issue-tracker workflow faster and safer without changing its operating philosophy: dumb tools, smart agents, explicit state, and visible failure.
- The existing starter document for this work is a discussion scaffold, not the final spec. The resolved design state captured in the grilling-session record should be treated as authoritative for implementation.
- The command surface should stay intentionally narrow in v1 so the tool becomes usable quickly and can later grow from proven operator needs rather than speculative admin features.
- The CLI's main value is consistency: one deterministic way to validate tracker state, discover the current feature, select the next issue, and update workflow metadata without manual file spelunking.

### Triage

Status: ready-for-agent
