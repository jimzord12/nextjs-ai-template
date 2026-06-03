#!/usr/bin/env bash
set -euo pipefail

QA_DIR=".qa"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPORT_DIR="${QA_DIR}/${TIMESTAMP}"
mkdir -p "${REPORT_DIR}"

FAILED=0
RESULTS=()

run_qa_script() {
  local name="$1"
  local cmd="$2"
  local logfile="${REPORT_DIR}/${name}.log"

  printf '\n━━━ Running %s ━━━\n' "${name}"

  # Check whether the npm script exists in package.json before running.
  local script_name
  script_name="${cmd#pnpm }"
  if ! grep -q "\"${script_name}\"" package.json 2>/dev/null; then
    RESULTS+=("⏭️  ${name} (skipped — script not found in package.json)")
    printf '⏭️  %s skipped — script not found in package.json\n' "${name}"
    return
  fi

  if eval "${cmd}" > "${logfile}" 2>&1; then
    RESULTS+=("✅ ${name}")
    printf '✅ %s passed\n' "${name}"
  else
    local exit_code=$?
    RESULTS+=("❌ ${name} (exit ${exit_code})")
    printf '❌ %s failed (exit %d)\n' "${name}" "${exit_code}"
    FAILED=1
  fi
}

echo "QA Report — $(date)"
echo "================================"

run_qa_script "performance"   "pnpm qa:performance"
run_qa_script "a11y"          "pnpm qa:a11y"
run_qa_script "seo"           "pnpm qa:seo"
run_qa_script "security"      "pnpm qa:security"
run_qa_script "bundle"        "pnpm qa:bundle"
run_qa_script "cross-browser" "pnpm qa:cross-browser"

# Copy report artifacts
cp -r playwright-report/ "${REPORT_DIR}/playwright-report" 2>/dev/null || true
cp -r .unlighthouse/ "${REPORT_DIR}/unlighthouse-report" 2>/dev/null || true

# Summary
printf '\n================================\n'
echo "QA Summary:"
for result in "${RESULTS[@]}"; do
  printf '  %s\n' "${result}"
done
echo "================================"

if [ "${FAILED}" -eq 1 ]; then
  printf '\n❌ QA FAILED — one or more checks did not pass\n'
  exit 1
fi

printf '\n✅ QA PASSED — all checks passed\n'
