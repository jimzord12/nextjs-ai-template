#!/usr/bin/env bash
set -euo pipefail

# ── Step 1: Prune stale remote-tracking refs ────────────────────────
# Branches deleted on GitHub (e.g. after squash-merge) leave ghost refs
# locally. This cleans them up.
PRUNED=false
PRUNE_OUTPUT=$(git fetch --prune 2>&1) || true
if echo "$PRUNE_OUTPUT" | grep -q "pruned"; then
  echo "$PRUNE_OUTPUT"
  PRUNED=true
else
  echo "Remote-tracking refs are clean."
fi

DRY_RUN=false

for arg in "$@"; do
  case "${arg}" in
    --dry-run) DRY_RUN=true ;;
    *)
      echo "Unknown flag: ${arg}" >&2
      echo "Usage: $0 [--dry-run]" >&2
      exit 1
      ;;
  esac
done

# Determine the default branch name (main or master).
DEFAULT_BRANCH=""
for candidate in main master; do
  if git show-ref --verify --quiet "refs/heads/${candidate}" 2>/dev/null; then
    DEFAULT_BRANCH="${candidate}"
    break
  fi
done

if [ -z "${DEFAULT_BRANCH}" ]; then
  echo "ERROR could not find main or master branch" >&2
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)

# Collect merged branches, excluding the default branch and current branch.
BRANCHES=()
while IFS= read -r branch; do
  BRANCHES+=("${branch}")
done < <(
  git branch --merged "${DEFAULT_BRANCH}" --format='%(refname:short)' \
    | grep -v -x "${DEFAULT_BRANCH}" \
    | grep -v -x "${CURRENT_BRANCH}" \
    | grep -v -x "master" \
    | grep -v -x "main" \
    || true
)

# Detect squash-merged branches (invisible to 'git branch --merged').
# Uses 'gh pr list' to check for merged PRs — the authoritative signal.
# Falls back to a warning if gh CLI or remote is unavailable.
SQUASH_MERGED=()
if command -v gh &>/dev/null && gh auth status &>/dev/null; then
  while IFS= read -r branch; do
    if gh pr list --state merged --head "${branch}" --json number --jq '.[0].number' 2>/dev/null | grep -q .; then
      SQUASH_MERGED+=("${branch}")
    fi
  done < <(
    git branch --format='%(refname:short)' \
      | grep -v -x "${DEFAULT_BRANCH}" \
      | grep -v -x "${CURRENT_BRANCH}" \
      | grep -v -x "master" \
      | grep -v -x "main" \
      | grep -v -xF -f <(printf '%s\n' "${BRANCHES[@]+"${BRANCHES[@]}"}") \
      || true
  )
  if [ ${#SQUASH_MERGED[@]} -gt 0 ]; then
    echo "Found ${#SQUASH_MERGED[@]} squash-merged branches (via GitHub)."
  fi
else
  echo "NOTE: gh CLI not available — squash-merged branches won't be detected." >&2
fi

if [ ${#SQUASH_MERGED[@]} -gt 0 ]; then
  BRANCHES+=("${SQUASH_MERGED[@]}")
fi

if [ ${#BRANCHES[@]} -eq 0 ]; then
  echo "No merged branches to clean up."
  exit 0
fi

if [ "${DRY_RUN}" = true ]; then
  echo "Merged branches that would be deleted:"
  for branch in "${BRANCHES[@]}"; do
    echo "  ${branch}"
  done
  echo ""
  echo "${#BRANCHES[@]} branches would be deleted."
  exit 0
fi

echo "Merged branches to be deleted:"
for branch in "${BRANCHES[@]}"; do
  echo "  ${branch}"
done
echo ""

printf "Delete %d branches? (y/N) " "${#BRANCHES[@]}"
read -r CONFIRM
if [ "${CONFIRM}" != "y" ] && [ "${CONFIRM}" != "Y" ]; then
  echo "Aborted."
  exit 0
fi

DELETED=0
for branch in "${BRANCHES[@]}"; do
  if git branch -d "${branch}" 2>/dev/null || git branch -D "${branch}" 2>/dev/null; then
    DELETED=$((DELETED + 1))
  else
    echo "WARN could not delete ${branch}" >&2
  fi
done

echo "Deleted ${DELETED} branches."
