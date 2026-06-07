#!/usr/bin/env bash
set -euo pipefail

THRESHOLD="${REACT_DOCTOR_THRESHOLD:-80}"

echo "Running react-doctor (score threshold: ${THRESHOLD})..."

# Use --json for machine-readable output — avoids fragility of parsing --score text.
RAW=$(pnpm exec react-doctor --json --json-compact -y 2>/dev/null)

if ! SCORE=$(echo "$RAW" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data['summary']['score'])
except Exception:
    sys.exit(1)
" 2>/dev/null); then
  echo "FAIL react-doctor — could not parse score from output"
  exit 1
fi

echo "Doctor score: ${SCORE}"

if [ "${SCORE}" -lt "${THRESHOLD}" ]; then
  echo "FAIL react-doctor (score ${SCORE} < ${THRESHOLD})"
  exit 1
fi

echo "PASS react-doctor (score ${SCORE} >= ${THRESHOLD})"
