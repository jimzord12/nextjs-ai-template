# Feature Review: {{feature-slug}}

> **Feature:** `{{feature-id}}-{{feature-slug}}`
> **Date:** {{YYYY-MM-DD}}
> **Attempt:** #{{N}}

---

## Summary

{{PASS/FAIL}} — {{X}}/{{Y}} acceptance criteria met, {{Z}} findings

## Acceptance Criteria

| #  | Criterion | Status           | Evidence         |
|----|-----------|------------------|------------------|
| 1  | ...       | PASS / FAIL / UNCLEAR | `file.ts:symbol` |
| 2  | ...       | PASS / FAIL / UNCLEAR | `file.ts:symbol` |

## QA Results

| Check      | Result       | Details |
|------------|--------------|---------|
| typecheck  | PASS / FAIL  | ...     |
| lint       | PASS / FAIL  | ...     |
| test       | PASS / FAIL  | ...     |

## Findings

- [ORPHAN] export X in `file.ts` — no importers found
- [DEAD] unreachable branch in `file.ts:L42`
- [GAP] no test for X

## Downstream Impact

_Include this section only for horizontal (infrastructure) features. For vertical features, write: "N/A — vertical feature."_

- Compatibility check results against dependent features
- Public API conformance with LLD specification

## Recommendation

**READY FOR HUMAN REVIEW** / **NEEDS FIXES BEFORE REVIEW**

_Recommendation logic:_
- _READY FOR HUMAN REVIEW_ — all criteria PASS, QA clean, no critical findings
- _NEEDS FIXES BEFORE REVIEW_ — any criterion FAILs, QA has errors, or critical orphans found
