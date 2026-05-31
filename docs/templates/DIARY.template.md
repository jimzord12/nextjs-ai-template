# Process Recording Diary Template

Use this template to create individual process diary records in `docs/diary/`. Each record should capture a meaningful chunk of work, usually about a day of implementation, debugging, planning, or review.

```markdown
# Process Recording Diary

## Header

Project Name:
Repository / Link:
Author(s):
Start Date:
Tech Stack:
Methodology (Agile / Kanban / etc.):

---

## Daily / Session Entry

Date: [YYYY-MM-DD]
Duration: [e.g. 3h]
Author: [name]

### Focus of the Day

[One sentence describing the main goal of this session]

### What Was Done

- [Task completed]
- [Code written, reviewed, or refactored]
- [Decision made]

### Thinking & Rationale

[Why this approach was chosen, including trade-offs considered]

### Blockers & Issues

- [What slowed progress, broke, or needed investigation]
- Status: [resolved / ongoing / escalated]

### Insights & Learnings

- [Something discovered, clarified, or worth reusing later]

### References & Links

- [PRs, commits, tickets, design docs, issue threads, external references]

### Next Steps

- [What should happen in the next session]

---

## Milestone Snapshot

### Milestone: [Name / Version / Sprint #]

Date:
Summary of progress:
Key decisions made:
Open questions / tech debt:
Demo or deliverable link:

---

## Retrospective Entry

### Retrospective: [Date or Phase Name]

What went well:
What was difficult:
What would I do differently:
Key lessons for next project:
```

## How To Use It

- Create a new file in `docs/diary/` for each new record.
- Name files as `DIARY-dd-mm-yyyy-xxxxx.md`, where `xxxxx` is a short random alphanumeric suffix.
- Use this template as the starting content for each new record file.
- Keep one record focused on one day or one coherent block of work.
- Skip sections that do not add value for that specific record.

## Tips

- Be brief but honest. The diary is most useful when it records real friction, not just polished summaries.
- Write entries on the same day when possible. A short entry written now is better than a perfect one written later.
- Link freely to commits, issues, PRs, tickets, and docs so the diary stays searchable.
- Do not force every section into every entry. The structure is a guide, not a checklist.
- Use the diary to explain why decisions were made so future contributors can follow the reasoning.
