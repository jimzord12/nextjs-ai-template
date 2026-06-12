import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..");

// Minimal JSON Schema validator (no dependencies)
type Schema = Record<string, unknown>;

function validateEnum(value: unknown, values: unknown[]): string | null {
  if (!values.includes(value)) return `Expected one of [${values.join(", ")}], got ${value}`;
  return null;
}

function validateSuw(data: Record<string, unknown>): string[] {
  const errors: string[] = [];
  const id = data.id as string;
  if (!/^SUW-\d{3}$/.test(id)) errors.push(`Invalid id: ${id}`);
  if (!data.title) errors.push("Missing title");
  if (!data.slug) errors.push("Missing slug");
  const validStates = ["planned","ready","inprogress","review","completed","promoted","blocked","needsrevision"];
  const stateErr = validateEnum(data.state, validStates);
  if (stateErr) errors.push(`state: ${stateErr}`);
  const validStages = ["pre_implementation","implementation"];
  const stageErr = validateEnum(data.stage, validStages);
  if (stageErr) errors.push(`stage: ${stageErr}`);
  const validActivities = ["interrogate","synthesize","review","promote"];
  const actErr = validateEnum(data.ai_activity, validActivities);
  if (actErr) errors.push(`ai_activity: ${actErr}`);
  if (typeof data.target_depth !== "number" || data.target_depth < 1 || data.target_depth > 5)
    errors.push("target_depth must be 1-5");
  return errors;
}

function validateStatus(data: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (!data.version) errors.push("Missing version");
  if (!data.summary || typeof data.summary !== "object") errors.push("Missing summary");
  return errors;
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) results.push(...walkDir(full));
    else results.push(full);
  }
  return results;
}

// Validate status.json
const statusPath = join(ROOT, "status.json");
try {
  const status = JSON.parse(readFileSync(statusPath, "utf8"));
  const errs = validateStatus(status);
  console.log(errs.length ? `FAIL ${statusPath}: ${errs.join(", ")}` : `PASS ${statusPath}`);
} catch (e) {
  console.log(`FAIL ${statusPath}: ${(e as Error).message}`);
}

// Validate all suw.json files
const milestonesDir = join(ROOT, "milestones");
try {
  const suwFiles = walkDir(milestonesDir).filter(f => f.endsWith("suw.json"));
  for (const f of suwFiles) {
    try {
      const suw = JSON.parse(readFileSync(f, "utf8"));
      const errs = validateSuw(suw);
      console.log(errs.length ? `FAIL ${f}: ${errs.join(", ")}` : `PASS ${f}`);
    } catch (e) {
      console.log(`FAIL ${f}: ${(e as Error).message}`);
    }
  }
  if (suwFiles.length === 0) console.log("INFO: No suw.json files found in milestones/");
} catch {
  console.log("INFO: milestones/ directory not found or empty");
}
