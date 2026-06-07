#!/usr/bin/env bash
set -euo pipefail

FORCE=false
DRY_RUN=false

for arg in "$@"; do
  case "${arg}" in
    --force)  FORCE=true ;;
    --dry-run) DRY_RUN=true ;;
    *)
      echo "Unknown flag: ${arg}" >&2
      echo "Usage: $0 [--force] [--dry-run]" >&2
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
  echo "${#BRANCHES[@]} branches would be deleted. Use --force to skip confirmation."
  exit 0
fi

echo "Merged branches to be deleted:"
for branch in "${BRANCHES[@]}"; do
  echo "  ${branch}"
done
echo ""

if [ "${FORCE}" = false ]; then
  printf "Delete %d branches? (y/N) " "${#BRANCHES[@]}"
  read -r CONFIRM
  if [ "${CONFIRM}" != "y" ] && [ "${CONFIRM}" != "Y" ]; then
    echo "Aborted."
    exit 0
  fi
fi

DELETED=0
for branch in "${BRANCHES[@]}"; do
  if git branch -d "${branch}" 2>/dev/null; then
    DELETED=$((DELETED + 1))
  else
    echo "WARN could not delete ${branch}" >&2
  fi
done

echo "Deleted ${DELETED} branches."
