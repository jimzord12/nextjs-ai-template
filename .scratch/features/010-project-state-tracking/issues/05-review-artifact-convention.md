Method: chore
Status: ready-for-agent
Complexity: 2
BlockedBy: 1

# Review artifact convention — template and `review-feature` skill update

## Parent

PRD: `.scratch/features/010-project-state-tracking/PRD.md`

## What to build

Establish the review artifact convention so that feature reviews live alongside the feature they belong to, with support for multiple review attempts.

### 1. Create review report template

Create `docs/templates/FEATURE_REVIEW.template.md`. The template provides a consistent structure for review reports. It should include sections for:

- Feature identification (id, slug)
- Review date and attempt number
- Per-acceptance-criterion verdict (pass/fail)
- Summary verdict (pass/fail)
- Issues found
- Recommended actions

### 2. Update `review-feature` skill

Update the `review-feature` skill to:
- Write reviews to `.scratch/features/<feature-dir>/reviews/` instead of `.qa/feature-reviews/`
- Use auto-incrementing file names: `01-review.md`, `02-review.md`, etc.
- Use the new template from `docs/templates/FEATURE_REVIEW.template.md`
- Scan existing `reviews/` directory to determine the next number

### 3. Update documentation

- Update `docs/ROUTINES.md` feature delivery pipeline table — the review report artifact location changes from `.qa/feature-reviews/<feature-name>.md` to `.scratch/features/<feature-dir>/reviews/<N>-review.md`
- Update any references in the pipeline step 6 description

## Acceptance criteria

- [ ] `docs/templates/FEATURE_REVIEW.template.md` exists with structured review format
- [ ] `review-feature` skill references new review path convention
- [ ] `review-feature` skill references the new template
- [ ] `docs/ROUTINES.md` pipeline table reflects new review artifact location
- [ ] No references to `.qa/feature-reviews/` remain in skill or pipeline docs

## Blocked by

- `01-rename-to-features-cli` — must use the new CLI name in any updated docs
