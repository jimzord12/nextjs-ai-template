#!/usr/bin/env npx tsx
/**
 * Delete a single handoff file from the workspace tmp/ directory.
 *
 * Exit codes:
 *   0 — success
 *   1 — general error (bad arguments, no tmp/ dir)
 *   2 — no match found
 *   3 — ambiguous match (multiple files)
 */

import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const TMP_DIR = join(process.cwd(), "tmp");

const HELP = `
Usage: npx tsx scripts/delete-handoff.ts [options] <identifier>

Delete a single handoff file by index, slug, filename, or path.

Options:
  --dry-run    Show what would be deleted without deleting
  --json       Output result as JSON
  --list       List available handoff files and exit
  --help       Show this help message

Identifiers:
  Index number   "1", "001"
  Slug           "todo-review"
  Filename       "001-handoff-todo-review.md"
  Path           "tmp/001-handoff-todo-review.md"

Examples:
  npx tsx scripts/delete-handoff.ts 001
  npx tsx scripts/delete-handoff.ts --dry-run todo-review
  npx tsx scripts/delete-handoff.ts --json tmp/001-handoff-todo-review.md
`.trim();

function listFiles(): string[] {
  if (!existsSync(TMP_DIR)) return [];
  return readdirSync(TMP_DIR).filter(
    (f) => f.endsWith(".md") && f.includes("-handoff-"),
  );
}

function matchFiles(identifier: string, files: string[]): string[] {
  const normalised = identifier.replace(/^tmp\//, "").replace(/\.md$/, "");

  return files.filter((f) => {
    if (f === normalised || f === `${normalised}.md`) return true;

    const indexMatch = normalised.match(/^\d+$/);
    if (indexMatch) {
      const padded = indexMatch[0].padStart(3, "0");
      if (f.startsWith(`${padded}-handoff-`)) return true;
    }

    if (f.includes(`-handoff-${normalised}`)) return true;

    return false;
  });
}

function output(
  result: { deleted: string[]; dryRun: boolean },
  asJson: boolean,
): void {
  if (asJson) {
    console.log(JSON.stringify({ ...result, success: true }));
    return;
  }
  if (result.deleted.length === 0) {
    console.log(result.dryRun ? "No files match." : "No files deleted.");
    return;
  }
  const verb = result.dryRun ? "Would delete" : "Deleted";
  for (const f of result.deleted) {
    console.log(`${verb}: ${f}`);
  }
}

// --- Parse args ---
const args = process.argv.slice(2);
let dryRun = false;
let asJson = false;
let listOnly = false;
const positional: string[] = [];

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
    continue;
  }
  if (arg === "--list") {
    listOnly = true;
    continue;
  }
  positional.push(arg);
}

if (listOnly) {
  const files = listFiles();
  if (asJson) {
    console.log(JSON.stringify({ files }));
  } else if (files.length === 0) {
    console.log("No handoff files in tmp/.");
  } else {
    for (const f of files) console.log(`  ${f}`);
  }
  process.exit(0);
}

const identifier = positional[0]?.trim();
if (!identifier) {
  console.error(`Error: identifier is required.\n\n${HELP}`);
  process.exit(1);
}

const files = listFiles();

if (files.length === 0) {
  const msg = "No handoff files found in tmp/.";
  if (asJson) {
    console.log(JSON.stringify({ success: false, error: msg, code: 2 }));
  } else {
    console.error(`Error: ${msg}`);
  }
  process.exit(2);
}

const matches = matchFiles(identifier, files);

if (matches.length === 0) {
  const msg = `No handoff file matches "${identifier}".`;
  const available = `Available:\n${files.map((f) => `  - ${f}`).join("\n")}`;
  if (asJson) {
    console.log(
      JSON.stringify({ success: false, error: msg, available: files, code: 2 }),
    );
  } else {
    console.error(`Error: ${msg}\n${available}`);
  }
  process.exit(2);
}

if (matches.length > 1) {
  const msg = `"${identifier}" matches multiple files. Use a more specific identifier.`;
  const matched = matches.map((f) => `  - ${f}`).join("\n");
  if (asJson) {
    console.log(
      JSON.stringify({ success: false, error: msg, matches, code: 3 }),
    );
  } else {
    console.error(`Error: ${msg}\n${matched}`);
  }
  process.exit(3);
}

const target = matches[0];
if (!dryRun) {
  rmSync(join(TMP_DIR, target));
}

output({ deleted: [target], dryRun }, asJson);
