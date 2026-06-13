#!/usr/bin/env npx tsx
/**
 * Delete all handoff files from the workspace tmp/ directory.
 *
 * Exit codes:
 *   0 — success (including no-op when no files found)
 *   1 — error (e.g. tmp/ is a file, not a directory)
 */

import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const TMP_DIR = join(process.cwd(), "tmp");

const HELP = `
Usage: npx tsx scripts/delete-all-handoffs.ts [options]

Delete all handoff files from the workspace tmp/ directory.

Options:
  --dry-run    Show what would be deleted without deleting
  --json       Output result as JSON
  --help       Show this help message

Examples:
  npx tsx scripts/delete-all-handoffs.ts
  npx tsx scripts/delete-all-handoffs.ts --dry-run
  npx tsx scripts/delete-all-handoffs.ts --json
`.trim();

// --- Parse args ---
const args = process.argv.slice(2);
let dryRun = false;
let asJson = false;

for (const arg of args) {
  if (arg === "--help" || arg === "-h") {
    console.log(HELP);
    process.exit(0);
  }
  if (arg === "--dry-run") {
    dryRun = true;
    continue;
  }
  if (arg === "--json") {
    asJson = true;
  }
}

if (!existsSync(TMP_DIR)) {
  const msg = "tmp/ directory does not exist — nothing to delete.";
  if (asJson) {
    console.log(JSON.stringify({ deleted: [], dryRun, message: msg }));
  } else {
    console.log(msg);
  }
  process.exit(0);
}

const stat = statSync(TMP_DIR);
if (!stat.isDirectory()) {
  const msg = "tmp/ exists but is not a directory.";
  if (asJson) {
    console.log(JSON.stringify({ success: false, error: msg }));
  } else {
    console.error(`Error: ${msg}`);
  }
  process.exit(1);
}

const files = readdirSync(TMP_DIR).filter(
  (f) => f.endsWith(".md") && f.includes("-handoff-"),
);

if (files.length === 0) {
  const msg = "No handoff files found in tmp/.";
  if (asJson) {
    console.log(JSON.stringify({ deleted: [], dryRun, message: msg }));
  } else {
    console.log(msg);
  }
  process.exit(0);
}

if (!dryRun) {
  for (const file of files) {
    rmSync(join(TMP_DIR, file));
  }
}

if (asJson) {
  console.log(JSON.stringify({ deleted: files, dryRun, count: files.length }));
} else {
  const verb = dryRun ? "Would delete" : "Deleted";
  console.log(
    `${verb} ${files.length} handoff file${files.length === 1 ? "" : "s"}:`,
  );
  for (const file of files) {
    console.log(`  - ${file}`);
  }
}
