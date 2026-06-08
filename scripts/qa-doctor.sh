#!/usr/bin/env bash
set -euo pipefail

THRESHOLD="${REACT_DOCTOR_THRESHOLD:-80}"

echo "Running react-doctor (score threshold: ${THRESHOLD})..."

# Capture full output (including diagnostics) and preserve exit status under pipefail.
TMP_OUTPUT="$(mktemp)"
cleanup() { rm -f "$TMP_OUTPUT"; }
trap cleanup EXIT

if ! pnpm exec react-doctor --score -y | tee "$TMP_OUTPUT"; then
  echo "FAIL react-doctor — command execution failed"
  exit 1
fi

# Extract the score from the last numeric-only line.
SCORE="$(grep -E '^[0-9]+$' "$TMP_OUTPUT" | tail -1 || true)"

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