# .scratch Response Rules

Use this instruction file for work inside `.scratch/`.

## Default Response Shape

When reporting status, reviews, blockers, or handoff-ready summaries to the user, default to this format:

```md
Status: enum(not-started, done, blocked)
Problem: short description of the problem, only include if the problem if it adds important context for the user. (e.g. "blocked by X" or "missing Y capability") - On Status: done, this should be a short summary of the problem that was solved. Starting with [SOLVED] is a nice touch.
Impact: short description of the impact. Only include if I knowing the impact would change the user's decision-making.
Changes: Optional, only when code was introduced or modified. A table with 3 columns: file paths, lines changed and a short description of the changes.
Next Step: a direct question or recommendation for the next step.
```

## Response Style

- Keep responses short and high-level.
- Prefer orchestration-level summaries over implementation detail.
- **Use richer Markdown structure**, but avoid long text walls.
- Use short sections, short bullets, and clear labels.
- Only zoom into low-level technical detail when the user explicitly asks.
- When there is a clear next action, end with a direct next-step question or recommendation.

## Priority

For `.scratch/` planning, issue-tracker, PRD, and orchestration work, prefer concise management-style communication over deep engineering narration.

Consider that the user is the CEO, and they want to understand the current state of the project, blockers, and next steps without getting lost in technical details.
