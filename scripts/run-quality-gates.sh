#!/usr/bin/env bash
set -euo pipefail

QA_DIR=".qa"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPORT_DIR="${QA_DIR}/full-run-${TIMESTAMP}"
mkdir -p "${REPORT_DIR}"

FAILED=0
RESULTS=()

run_gate() {
  local command="$1"
  local name
  name=$(echo "${command}" | tr ' :' '__')
  local logfile="${REPORT_DIR}/${name}.log"

  echo "=== RUN ${command} ==="
  if eval "${command}" > "${logfile}" 2>&1; then
    RESULTS+=("PASS|${command}")
  else
    local exit_code=$?
    RESULTS+=("FAIL|${command}|${exit_code}")
    FAILED=1
  fi
}

echo "Full gate report directory: ${REPORT_DIR}"

run_gate "pnpm check"
run_gate "pnpm test"
run_gate "pnpm build"
run_gate "pnpm qa"

echo ""
echo "=== SUMMARY ==="
for result in "${RESULTS[@]}"; do
  IFS='|' read -r status command exit_code <<< "${result}"
  if [ "${status}" = "PASS" ]; then
    echo "PASS ${command}"
  else
    echo "FAIL ${command} (exit ${exit_code})"
  fi
done

if [ "${FAILED}" -eq 1 ]; then
  exit 1
fi
