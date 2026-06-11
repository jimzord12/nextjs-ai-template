import { readdir, unlink, rmdir } from "node:fs/promises";
import { join } from "node:path";

const SCREENSHOTS_DIR = join(import.meta.dir, "..", "screenshots");

async function cleanScreenshots() {
  let files: string[];
  try {
    files = await readdir(SCREENSHOTS_DIR);
  } catch {
    console.log("screenshots/ directory does not exist — nothing to clean.");
    return;
  }

  if (files.length === 0) {
    console.log("screenshots/ is already empty.");
    return;
  }

  for (const file of files) {
    await unlink(join(SCREENSHOTS_DIR, file));
  }

  await rmdir(SCREENSHOTS_DIR);
  console.log(`Deleted ${files.length} screenshot${files.length === 1 ? "" : "s"} and removed screenshots/ directory.`);
}

cleanScreenshots();
