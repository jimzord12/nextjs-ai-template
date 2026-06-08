#!/usr/bin/env bash
set -euo pipefail

# ── QA Gate: SEO ──────────────────────────────────────────────────────────
# Runs Lighthouse SEO audits against all locale pages and asserts each
# page meets the minimum SEO score threshold.
#
# Run with:  pnpm qa:seo
#
# Outputs:
#   .qa/seo-result-<locale>.report.html  — per-locale Lighthouse HTML report
#   .qa/seo-summary.json          — consolidated scores (for CI parsing)
# ──────────────────────────────────────────────────────────────────────────

BASE_URL="http://localhost:3000"
QA_DIR=".qa"
SEO_THRESHOLD=80

# Current SEO gate is 80. Raise it to 100 once the Hotel Example has full SEO
# setup (meta descriptions, structured data, canonical URLs, robots.txt,
# sitemap.xml, etc.).
# See: .scratch/production-template-baseline/issues/14-seo-qa.md

PAGES=("/en" "/el" "/de")

# ── Cleanup ──────────────────────────────────────────────────────────────
cleanup() {
  if [ -n "${SERVER_PID:-}" ] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    kill "${SERVER_PID}" 2>/dev/null || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# ── Build & start server ─────────────────────────────────────────────────
echo "▸ Building Next.js…"
pnpm build >/dev/null

echo "▸ Starting production server…"
pnpm start >/tmp/qa-seo-next-start.log 2>&1 &
SERVER_PID=$!

echo "▸ Waiting for server…"
for _ in $(seq 1 60); do
  if curl -sf "${BASE_URL}/en" >/dev/null; then
    break
  fi
  sleep 1
done

if ! curl -sf "${BASE_URL}/en" >/dev/null; then
  echo "✗ Next.js server did not become ready at ${BASE_URL}" >&2
  exit 1
fi
echo "  Server ready at ${BASE_URL}"

# ── Prepare output directory ─────────────────────────────────────────────
mkdir -p "${QA_DIR}"

# ── Run Lighthouse SEO audit per page ────────────────────────────────────
FAILED=0
SUMMARY_FILE="${QA_DIR}/seo-summary.json"
echo "[" > "${SUMMARY_FILE}"

FIRST=true

for PAGE in "${PAGES[@]}"; do
  LOCALE="${PAGE#/}"             # en, el, de
  REPORT="${QA_DIR}/seo-result-${LOCALE}.report.html"
  JSON_REPORT="${QA_DIR}/seo-result-${LOCALE}.report.json"

  echo ""
  echo "▸ Auditing ${PAGE} (SEO)…"

  pnpm exec lighthouse "${BASE_URL}${PAGE}" \
    --only-categories=seo \
    --output=html \
    --output=json \
    --output-path="${QA_DIR}/seo-result-${LOCALE}" \
    --chrome-flags="--headless --no-sandbox" \
    --quiet \
    || true

  # Lighthouse writes seo-result-<locale>.html and seo-result-<locale>.json
  # Parse the JSON to extract the SEO score
  if [ -f "${JSON_REPORT}" ]; then
    SCORE=$(node -e "
      const r = require('./${JSON_REPORT}');
      const s = r.categories?.seo?.score ?? 0;
      console.log(Math.round(s * 100));
    ")
  else
    SCORE=0
  fi

  echo "  SEO score: ${SCORE}/100 (threshold: ${SEO_THRESHOLD})"

  # Append to summary JSON
  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    echo "," >> "${SUMMARY_FILE}"
  fi
  echo "  {\"page\": \"${PAGE}\", \"score\": ${SCORE}}" >> "${SUMMARY_FILE}"

  if [ "${SCORE}" -lt "${SEO_THRESHOLD}" ]; then
    echo "  ✗ FAILED — ${PAGE} SEO score ${SCORE} is below threshold ${SEO_THRESHOLD}"
    FAILED=1
  else
    echo "  ✓ PASSED"
  fi
done

echo "]" >> "${SUMMARY_FILE}"

# ── Final summary ────────────────────────────────────────────────────────
echo ""
echo "──────────────────────────────────────────────"
echo " SEO QA Summary"
echo "──────────────────────────────────────────────"

node -e "
  const data = require('./${QA_DIR}/seo-summary.json');
  data.forEach(r => {
    const icon = r.score >= ${SEO_THRESHOLD} ? '✓' : '✗';
    console.log('  ' + icon + ' ' + r.page + ': ' + r.score + '/100');
  });
  const failed = data.some(r => r.score < ${SEO_THRESHOLD});
  console.log('');
  console.log('Reports written to ${QA_DIR}/seo-result-<locale>.report.{html,json}');
  process.exit(failed ? 1 : 0);
"

exit ${FAILED}
