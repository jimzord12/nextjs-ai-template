#!/usr/bin/env bash
set -euo pipefail

THRESHOLD="${REACT_DOCTOR_THRESHOLD:-80}"

echo "Running react-doctor (score threshold: ${THRESHOLD})..."

SCORE=$(pnpm exec react-doctor --score -y 2>&1)

# react-doctor --score outputs a bare integer, but may include other lines
# (e.g. wall time) — extract the last numeric token on its own line.
SCORE=$(echo "$SCORE" | grep -oE '^[0-9]+$' | tail -1)

if [ -z "${SCORE}" ]; then
  echo "FAIL react-doctor — could not parse score from output"
  exit 1
fi

echo "Doctor score: ${SCORE}"

if [ "${SCORE}" -lt "${THRESHOLD}" ]; then
  echo "FAIL react-doctor (score ${SCORE} < ${THRESHOLD})"
  exit 1
fi

echo "PASS react-doctor (score ${SCORE} >= ${THRESHOLD})"
