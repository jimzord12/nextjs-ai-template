/**
 * Ralph Loop — iterative AI development with the Pi SDK
 *
 * What this does:
 *   1. Reads a PRD (or any goal spec) from a file you provide.
 *   2. Runs the Pi agent in a loop. Each iteration:
 *      - Starts a fresh session (fresh context window — no context rot).
 *      - Injects the PRD + a progress checklist so the agent sees prior work.
 *      - Lets the agent edit code, run tests, fix failures.
 *      - Evaluates a completion condition (e.g. "all tests pass").
 *   3. Stops when the condition is met OR max iterations is hit.
 *
 * Why fresh sessions each iteration?
 *   Long conversations degrade model coherence ("context rot"). By giving
 *   the agent a fresh context each time but preserving state in files + git,
 *   the model sees its own previous work clearly and doesn't get confused.
 *
 * Future Improvements:
 *   - Create a more structured progress format (e.g. YAML or JSON) instead of markdown parsing.
 *   - There should be a Template for the PRD, which would allow easier parsing and more structured prompts.
 *
 * Usage:
 *   tsx scripts/ralph-loop.ts --prd .scratch/prd.md --check "npm test"
 *   tsx scripts/ralph-loop.ts --prd .scratch/prd.md --check "npm test" --max 10
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// Module resolution
//
// The Pi SDK lives inside the global pi installation. We use dynamic import()
// to load it without declaring it as a dependency of the host project.
// ---------------------------------------------------------------------------

const PI_PKG = "@earendil-works/pi-coding-agent";

async function loadSdk() {
  // Find the global pi installation directory
  const globalDir =
    process.env.PI_MODULE_ROOT ??
    (() => {
      try {
        const prefix = execSync("npm prefix -g", { encoding: "utf-8" }).trim();
        return `${prefix}/lib/node_modules/${PI_PKG}`;
      } catch {
        return undefined;
      }
    })();

  if (!globalDir) {
    console.error(
      `Cannot locate ${PI_PKG}. Install pi globally or set PI_MODULE_ROOT.`,
    );
    process.exit(1);
  }

  const piSdk = await import(`file://${globalDir}/dist/index.js`);
  return piSdk;
}

const piSdk = await loadSdk();

const {
  AuthStorage,
  createAgentSession,
  ModelRegistry,
  SessionManager,
  SettingsManager,
  createExtensionRuntime,
} = piSdk;

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

interface RalphConfig {
  /** Path to the PRD / goal spec file */
  prdPath: string;
  /** Shell command that signals "done" when it exits 0 */
  checkCommand: string;
  /** Maximum loop iterations before giving up */
  maxIterations: number;
  /** Model to use (id substring match) */
  model: string;
  /** Working directory (defaults to cwd) */
  cwd: string;
  /** Path to the progress checklist file */
  checklistPath: string;
  /** Thinking level */
  thinkingLevel: string;
}

function parseArgs(args: string[]): RalphConfig {
  const get = (flag: string, fallback?: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : fallback;
  };

  const prdPath = get("--prd");
  if (!prdPath) {
    console.error(
      "Usage: ralph-loop.ts --prd <path> --check <command> [--max N] [--model <id>] [--thinking <level>]",
    );
    console.error();
    console.error("Options:");
    console.error("  --prd <path>        Path to PRD / goal spec (required)");
    console.error(
      "  --check <command>   Shell command to verify completion (default: npm test)",
    );
    console.error("  --max <N>           Max iterations (default: 10)");
    console.error(
      "  --model <id>        Model id substring (default: claude-sonnet-4-20250514)",
    );
    console.error(
      "  --thinking <level>  off|minimal|low|medium|high (default: medium)",
    );
    process.exit(1);
  }

  const cwd = get("--cwd", process.cwd());
  const modelName = get("--model", "claude-sonnet-4-20250514");

  return {
    prdPath: resolve(cwd!, prdPath!),
    checkCommand: get("--check", "npm test")!,
    maxIterations: parseInt(get("--max", "10")!, 10),
    model: modelName!,
    cwd: cwd!,
    checklistPath: resolve(cwd!, ".ralph-progress.md"),
    thinkingLevel: get("--thinking", "medium")!,
  };
}

// ---------------------------------------------------------------------------
// Progress checklist management
// ---------------------------------------------------------------------------

function readChecklist(path: string): string {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf-8");
}

function initializeChecklist(path: string): void {
  if (!existsSync(path)) {
    writeFileSync(path, "# Ralph Loop Progress\n\nNo work done yet.\n");
  }
}

// ---------------------------------------------------------------------------
// Completion check — runs the check command, returns true if exit code 0
// ---------------------------------------------------------------------------

function runCheck(
  command: string,
  cwd: string,
): { passed: boolean; output: string } {
  try {
    const output = execSync(command, {
      cwd,
      encoding: "utf-8",
      timeout: 120_000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { passed: true, output };
  } catch (err: any) {
    const output = `${err.stdout ?? ""}\n${err.stderr ?? ""}`;
    return { passed: false, output };
  }
}

// ---------------------------------------------------------------------------
// Build the prompt for one iteration
// ---------------------------------------------------------------------------

function buildIterationPrompt(
  config: RalphConfig,
  iteration: number,
  lastCheckOutput: string | null,
): string {
  const prd = readFileSync(config.prdPath, "utf-8");
  const checklist = readChecklist(config.checklistPath);

  const parts: string[] = [];

  parts.push(`# Ralph Loop — Iteration ${iteration}/${config.maxIterations}`);
  parts.push("");
  parts.push(
    "You are an AI developer working in an automated loop. Each iteration you receive",
  );
  parts.push(
    "fresh context: the goal, your progress so far, and any test/command output.",
  );
  parts.push("");
  parts.push("## Goal (PRD)");
  parts.push("");
  parts.push(prd);

  if (checklist) {
    parts.push("");
    parts.push("## Progress So Far (from previous iterations)");
    parts.push("");
    parts.push(checklist);
  }

  if (lastCheckOutput !== null) {
    parts.push("");
    parts.push("## Last Check Output (from previous iteration)");
    parts.push("");
    parts.push("```");
    const truncated =
      lastCheckOutput.length > 10_000
        ? lastCheckOutput.slice(0, 10_000) + "\n... (truncated)"
        : lastCheckOutput;
    parts.push(truncated);
    parts.push("```");
  }

  parts.push("");
  parts.push("## Instructions");
  parts.push("");
  parts.push(
    "1. Read the PRD carefully. Understand the goal and success criteria.",
  );
  parts.push("2. Read the progress checklist to see what's already been done.");
  parts.push(
    "3. If there was a previous failed check, analyze the errors and fix them.",
  );
  parts.push(
    "4. Pick the next piece of work and do it. Edit files, run commands, write tests.",
  );
  parts.push(
    "5. After your changes, update the progress checklist at `.ralph-progress.md`:",
  );
  parts.push("   - Mark completed items with ✅");
  parts.push("   - Add new items you discovered");
  parts.push("   - Note any blockers or issues");
  parts.push(
    `6. Run the check command (\`${config.checkCommand}\`) yourself via bash to verify.`,
  );
  parts.push("");
  parts.push(
    "Be thorough but focused. Fix one thing at a time. Commit your work if it makes sense.",
  );

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Run a single iteration of the Ralph loop
// ---------------------------------------------------------------------------

async function runIteration(
  config: RalphConfig,
  iteration: number,
  lastCheckOutput: string | null,
): Promise<void> {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  RALPH LOOP — Iteration ${iteration}/${config.maxIterations}`);
  console.log(`${"=".repeat(60)}\n`);

  // Resolve model via the registry
  const authStorage = AuthStorage.create();
  const modelRegistry = ModelRegistry.create(authStorage);

  const available = await modelRegistry.getAvailable();
  const model = available.find(
    (m: any) => m.id === config.model || m.id.includes(config.model),
  );
  if (!model) {
    const ids = available.map((m: any) => `${m.provider}/${m.id}`).join(", ");
    throw new Error(`Model "${config.model}" not found. Available: ${ids}`);
  }

  console.log(`  Model: ${model.provider}/${model.id}`);
  console.log(`  Check: ${config.checkCommand}`);
  console.log(`  PRD:   ${config.prdPath}\n`);

  // In-memory settings — no compaction, retry enabled
  const settingsManager = SettingsManager.inMemory({
    compaction: { enabled: false },
    retry: { enabled: true, maxRetries: 2 },
  });

  // Minimal resource loader — no extensions/skills/themes
  const resourceLoader = {
    getExtensions: () => ({
      extensions: [],
      errors: [],
      runtime: createExtensionRuntime(),
    }),
    getSkills: () => ({ skills: [], diagnostics: [] }),
    getPrompts: () => ({ prompts: [], diagnostics: [] }),
    getThemes: () => ({ themes: [], diagnostics: [] }),
    getAgentsFiles: () => ({ agentsFiles: [] }),
    getSystemPrompt: () =>
      "You are an expert software developer working in an automated loop. " +
      "You have access to read, edit, write, and bash tools. " +
      "Be methodical: read before editing, test after editing. " +
      "Always update .ralph-progress.md with your progress at the end of each iteration.",
    getAppendSystemPrompt: () => [],
    extendResources: () => {},
    reload: async () => {},
  };

  // KEY: Fresh in-memory session for this iteration (avoids context rot)
  const { session } = await createAgentSession({
    cwd: config.cwd,
    model,
    thinkingLevel: config.thinkingLevel,
    authStorage,
    modelRegistry,
    resourceLoader,
    tools: ["read", "bash", "edit", "write"],
    sessionManager: SessionManager.inMemory(config.cwd),
    settingsManager,
  });

  try {
    // Stream the agent's output to the console
    session.subscribe((event: any) => {
      switch (event.type) {
        case "message_update":
          if (event.assistantMessageEvent.type === "text_delta") {
            process.stdout.write(event.assistantMessageEvent.delta);
          }
          break;

        case "tool_execution_start":
          console.log(
            `\n  🔧 Tool: ${event.toolName}(${JSON.stringify(event.args).slice(0, 120)}...)`,
          );
          break;

        case "tool_execution_end":
          if (event.isError) {
            console.log(`  ❌ Tool failed: ${event.toolName}`);
          }
          break;
      }
    });

    // Build and send the prompt
    const prompt = buildIterationPrompt(config, iteration, lastCheckOutput);
    await session.prompt(prompt);

    console.log("\n  ✅ Iteration complete.\n");
  } finally {
    session.dispose();
  }
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

async function main() {
  const config = parseArgs(process.argv.slice(2));

  if (!existsSync(config.prdPath)) {
    console.error(`PRD file not found: ${config.prdPath}`);
    process.exit(1);
  }

  console.log("╔══════════════════════════════════════════╗");
  console.log("║          RALPH LOOP — Starting           ║");
  console.log("╠══════════════════════════════════════════╣");
  console.log(`║  PRD:    ${config.prdPath.padEnd(30)}║`);
  console.log(`║  Check:  ${config.checkCommand.padEnd(30)}║`);
  console.log(`║  Max:    ${String(config.maxIterations).padEnd(30)}║`);
  console.log(`║  Model:  ${config.model.padEnd(30)}║`);
  console.log("╚══════════════════════════════════════════╝\n");

  initializeChecklist(config.checklistPath);

  // Pre-loop check — maybe it's already done!
  console.log("Running initial check...");
  const initialCheck = runCheck(config.checkCommand, config.cwd);
  if (initialCheck.passed) {
    console.log("\n🎉 Check passed before any work! Nothing to do.\n");
    process.exit(0);
  }
  console.log("Initial check failed (expected — we have work to do).\n");

  let lastCheckOutput: string | null = initialCheck.output;

  // The Ralph loop: iterate until check passes or budget exhausted
  for (let i = 1; i <= config.maxIterations; i++) {
    await runIteration(config, i, lastCheckOutput);

    console.log("Running completion check...");
    const check = runCheck(config.checkCommand, config.cwd);
    lastCheckOutput = check.output;

    if (check.passed) {
      console.log(`\n${"🎉".repeat(20)}`);
      console.log(`  SUCCESS — Check passed after ${i} iteration(s)!`);
      console.log(`  Command: ${config.checkCommand}`);
      console.log(`${"🎉".repeat(20)}\n`);

      if (existsSync(config.checklistPath)) {
        console.log(`Progress checklist: ${config.checklistPath}`);
      }
      process.exit(0);
    }

    console.log(
      `\n  ⚠️  Check failed. ${config.maxIterations - i} iteration(s) remaining.\n`,
    );
    console.log(
      `  Last check output (first 500 chars):\n${check.output.slice(0, 500)}\n`,
    );
  }

  // Exhausted all iterations
  console.log(`\n${"⚠️".repeat(10)}`);
  console.log(
    `  RALPH LOOP — Exhausted ${config.maxIterations} iterations without success.`,
  );
  console.log(`  Last check: ${config.checkCommand}`);
  console.log(`  Progress file: ${config.checklistPath}`);
  console.log(`${"⚠️".repeat(10)}\n`);
  process.exit(1);
}

main().catch((err) => {
  console.error("Ralph loop crashed:", err);
  process.exit(1);
});
