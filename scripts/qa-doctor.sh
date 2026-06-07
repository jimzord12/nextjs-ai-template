#!/usr/bin/env bash
set -euo pipefail

THRESHOLD="${REACT_DOCTOR_THRESHOLD:-80}"

echo "Running react-doctor (score threshold: ${THRESHOLD})..."

# --score outputs the picker line + bare integer on stdout. Grab the last numeric line.
SCORE=$(pnpm exec react-doctor --score -y | tail -1)

if ! [[ "${SCORE}" =~ ^[0-9]+$ ]]; then
  echo "FAIL react-doctor — could not parse score from output"
  exit 1
fi

echo "Doctor score: ${SCORE}"

if [ "${SCORE}" -lt "${THRESHOLD}" ]; then
  echo "FAIL react-doctor (score ${SCORE} < ${THRESHOLD})"
  exit 1
fi

echo "PASS react-doctor (score ${SCORE} >= ${THRESHOLD})"
