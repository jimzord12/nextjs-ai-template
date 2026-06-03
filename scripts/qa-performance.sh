#!/usr/bin/env bash
set -euo pipefail

BASE_URL="http://localhost:3000"

cleanup() {
  if [ -n "${SERVER_PID:-}" ] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    kill "${SERVER_PID}" 2>/dev/null || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
}

trap cleanup EXIT

pnpm build >/dev/null
pnpm start >/tmp/qa-performance-next-start.log 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 60); do
  if curl -sf "${BASE_URL}/en" >/dev/null; then
    break
  fi
  sleep 1
done

if ! curl -sf "${BASE_URL}/en" >/dev/null; then
  echo "Next.js server did not become ready at ${BASE_URL}" >&2
  exit 1
fi

pnpm exec unlighthouse-ci --site "${BASE_URL}" --budget 90 --build-static
