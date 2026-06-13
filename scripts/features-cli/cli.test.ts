// @vitest-environment node

import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";
import { runIssuesManagerCli } from "./cli";

const workspaces: string[] = [];
const execFileAsync = promisify(execFile);
const binPath = join(process.cwd(), "scripts", "features-cli", "bin.ts");
const tsRuntime = process.platform === "win32" ? "tsx.cmd" : "tsx";
const tsRuntimeArgs: [string, ...string[]] = [binPath];

async function createWorkspace(featuresStatus: object) {
  const workspacePath = await mkdtemp(join(tmpdir(), "issues-manager-cli-"));
  const scratchPath = join(workspacePath, ".scratch");

  workspaces.push(workspacePath);

  await mkdir(scratchPath, { recursive: true });

  await writeFile(
    join(scratchPath, "features-status.json"),
    JSON.stringify(featuresStatus, null, 2),
    "utf8",
  );

  return workspacePath;
}

async function writeIssuesState(
  workspacePath: string,
  featureSlug: string,
  issuesState: {
    featureId: number;
    featureSlug: string;
    featureStatus?: string;
    issues: Array<{
      id: number;
      title: string;
      status: string;
      method: string;
      complexity: number;
      filePath: string;
      blockedBy?: number[];
    }>;
  },
) {
  const featureId = issuesState.featureId;
  const normalizedIssuesState = {
    ...issuesState,
    issues: issuesState.issues.map((issue) => ({
      ...issue,
      blockedBy: issue.blockedBy ?? [],
    })),
  };

  await writeIssuesStateFile(
    workspacePath,
    featureId,
    featureSlug,
    JSON.stringify(normalizedIssuesState, null, 2),
  );
}

async function writeIssuesStateFile(
  workspacePath: string,
  featureId: number,
  featureSlug: string,
  contents: string,
) {
  const featureDir = `${String(featureId).padStart(3, "0")}-${featureSlug}`;
  const featurePath = join(workspacePath, ".scratch", "features", featureDir);

  await mkdir(featurePath, { recursive: true });
  await writeFile(join(featurePath, "issues-status.json"), contents, "utf8");
}

async function writeIssueMarkdown(
  workspacePath: string,
  featureId: number,
  featureSlug: string,
  fileName: string,
  contents: string,
) {
  const featureDir = `${String(featureId).padStart(3, "0")}-${featureSlug}`;
  const issuesDir = join(
    workspacePath,
    ".scratch",
    "features",
    featureDir,
    "issues",
  );

  await mkdir(issuesDir, { recursive: true });
  await writeFile(join(issuesDir, fileName), contents, "utf8");
}

afterEach(async () => {
  await Promise.all(
    workspaces
      .splice(0)
      .map((path) => rm(path, { recursive: true, force: true })),
  );
});

describe("runIssuesManagerCli", () => {
  it("lists issues for the current feature from the derived issue state by default", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "in-progress" },
        { id: 2, slug: "production-template-baseline", status: "todo" },
      ],
    });

    await writeIssuesState(workspacePath, "issues-manager-cli", {
      featureId: 1,
      featureSlug: "issues-manager-cli",
      featureStatus: "in-progress",
      issues: [
        {
          id: 1,
          title: "Derived feature scope title",
          status: "done",
          method: "tdd",
          complexity: 3,
          filePath:
            ".scratch/features/001-issues-manager-cli/issues/01-feature-scope-inspection-and-activation.md",
        },
        {
          id: 2,
          title: "Derived inventory title",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 3,
          filePath:
            ".scratch/features/001-issues-manager-cli/issues/02-issue-inventory-for-a-feature.md",
        },
      ],
    });

    const result = await runIssuesManagerCli(["list-issues"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Feature issues");
    expect(result.stdout).toContain("id: 1");
    expect(result.stdout).toContain("slug: issues-manager-cli");
    expect(result.stdout).toContain("status: in-progress");
    expect(result.stdout).toContain("Derived feature scope title");
    expect(result.stdout).toContain("Derived inventory title");
    expect(result.stdout).toContain(
      ".scratch/features/001-issues-manager-cli/issues/01-feature-scope-inspection-and-activation.md",
    );
    expect(result.stdout).toContain(
      ".scratch/features/001-issues-manager-cli/issues/02-issue-inventory-for-a-feature.md",
    );
  });

  it("lists issues for an explicit feature target without resolving the current feature", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "in-progress" },
        { id: 2, slug: "production-template-baseline", status: "archived" },
        { id: 3, slug: "design-system", status: "in-progress" },
      ],
    });

    await writeIssuesState(workspacePath, "production-template-baseline", {
      featureId: 2,
      featureSlug: "production-template-baseline",
      featureStatus: "archived",
      issues: [
        {
          id: 17,
          title: "Derived documentation title",
          status: "ready-for-agent",
          method: "chore",
          complexity: 3,
          filePath:
            ".scratch/production-template-baseline/issues/17-documentation.md",
        },
      ],
    });

    const result = await runIssuesManagerCli(
      ["list-issues", "--feature", "production-template-baseline"],
      {
        cwd: workspacePath,
      },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Feature issues");
    expect(result.stdout).toContain("slug: production-template-baseline");
    expect(result.stdout).toContain("status: archived");
    expect(result.stdout).toContain("Derived documentation title");
    expect(result.stdout).toContain(
      ".scratch/production-template-baseline/issues/17-documentation.md",
    );
  });

  it("filters list output to actionable issues when --actionable is provided", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssuesState(workspacePath, "issues-manager-cli", {
      featureId: 1,
      featureSlug: "issues-manager-cli",
      featureStatus: "in-progress",
      issues: [
        {
          id: 1,
          title: "Should be filtered in",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 2,
          blockedBy: [3],
          filePath: ".scratch/features/001-issues-manager-cli/issues/01.md",
        },
        {
          id: 2,
          title: "Blocked by unresolved issue",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 3,
          blockedBy: [4],
          filePath: ".scratch/features/001-issues-manager-cli/issues/02.md",
        },
        {
          id: 3,
          title: "Finished blocker",
          status: "done",
          method: "tdd",
          complexity: 1,
          blockedBy: [],
          filePath: ".scratch/features/001-issues-manager-cli/issues/03.md",
        },
        {
          id: 4,
          title: "Non-terminal blocker",
          status: "wontfix",
          method: "tdd",
          complexity: 1,
          blockedBy: [],
          filePath: ".scratch/features/001-issues-manager-cli/issues/04.md",
        },
      ],
    });

    const result = await runIssuesManagerCli(["list-issues", "--actionable"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Feature issues (actionable)");
    expect(result.stdout).toContain("Should be filtered in");
    expect(result.stdout).not.toContain("Blocked by unresolved issue");
    expect(result.stdout).not.toContain("Finished blocker");
    expect(result.stdout).not.toContain("Non-terminal blocker");
  });

  it("fails descriptively on blocker-aware reads when canonical blocker data is missing", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssuesStateFile(
      workspacePath,
      1,
      "issues-manager-cli",
      JSON.stringify(
        {
          featureId: 1,
          featureSlug: "issues-manager-cli",
          featureStatus: "in-progress",
          issues: [
            {
              id: 1,
              title: "Legacy blockers only",
              status: "ready-for-agent",
              method: "tdd",
              complexity: 3,
              filePath: ".scratch/features/001-issues-manager-cli/issues/01.md",
            },
          ],
        },
        null,
        2,
      ),
    );

    const result = await runIssuesManagerCli(["list-issues", "--actionable"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Missing canonical BlockedBy field");
    expect(result.stderr).toContain("legacy prose-only blockers");
  });

  it("updates blockers and normalizes a legacy issue through the explicit write flow", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssueMarkdown(
      workspacePath,
      1,
      "issues-manager-cli",
      "01-legacy.md",
      [
        "Status: ready-for-agent",
        "Method: tdd",
        "Complexity: 3",
        "",
        "# Legacy issue",
        "",
        "## Blocked by",
        "",
        "- `02-done`",
        "",
      ].join("\n"),
    );

    await writeIssueMarkdown(
      workspacePath,
      1,
      "issues-manager-cli",
      "02-done.md",
      [
        "Status: done",
        "Method: tdd",
        "Complexity: 2",
        "BlockedBy: none",
        "",
        "# Done dependency",
        "",
      ].join("\n"),
    );

    const result = await runIssuesManagerCli(
      ["update-blockers", "1", "--blockers", "2"],
      {
        cwd: workspacePath,
      },
    );

    const updatedIssue = await readFile(
      join(
        workspacePath,
        ".scratch",
        "features",
        "001-issues-manager-cli",
        "issues",
        "01-legacy.md",
      ),
      "utf8",
    );
    const regenerated = JSON.parse(
      await readFile(
        join(
          workspacePath,
          ".scratch",
          "features",
          "001-issues-manager-cli",
          "issues-status.json",
        ),
        "utf8",
      ),
    ) as {
      issues: Array<{ id: number; blockedBy: number[] }>;
    };

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Updated blockers");
    expect(result.stdout).toContain("issue: 1");
    expect(result.stdout).toContain("blockedBy: 2");
    expect(updatedIssue).toContain("BlockedBy: 2");
    expect(updatedIssue).not.toContain("## Blocked by");
    expect(
      regenerated.issues.find((issue) => issue.id === 1)?.blockedBy,
    ).toEqual([2]);
  });

  it("fails update-blockers when feature-wide regeneration finds another non-canonical issue", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssueMarkdown(
      workspacePath,
      1,
      "issues-manager-cli",
      "01-target.md",
      [
        "Status: ready-for-agent",
        "Method: tdd",
        "Complexity: 3",
        "",
        "# Target issue",
        "",
        "## Blocked by",
        "",
        "- `02-other`",
        "",
      ].join("\n"),
    );

    await writeIssueMarkdown(
      workspacePath,
      1,
      "issues-manager-cli",
      "02-still-legacy.md",
      [
        "Status: ready-for-agent",
        "Method: tdd",
        "Complexity: 2",
        "",
        "# Still legacy",
        "",
        "## Blocked by",
        "",
        "- none",
        "",
      ].join("\n"),
    );

    const result = await runIssuesManagerCli(
      ["update-blockers", "1", "--blockers", "none"],
      {
        cwd: workspacePath,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("legacy prose-only blocker section");
    expect(result.stderr).toContain("02-still-legacy.md");
  });

  it("fails descriptively when the derived issue state is missing", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    const result = await runIssuesManagerCli(["list-issues"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Missing derived issue state");
    expect(result.stderr).toContain(
      "features/001-issues-manager-cli/issues-status.json",
    );
  });

  it("fails descriptively when the derived issue state is malformed", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "todo" }],
    });

    await writeIssuesStateFile(
      workspacePath,
      1,
      "issues-manager-cli",
      "not json\n",
    );

    const result = await runIssuesManagerCli(
      ["list-issues", "--feature", "issues-manager-cli"],
      {
        cwd: workspacePath,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Malformed derived issue state");
    expect(result.stderr).toContain(
      "features/001-issues-manager-cli/issues-status.json",
    );
  });

  it("shows the current feature when exactly one feature is in progress", async () => {
    const workspacePath = await createWorkspace({
      version: "1",
      nextFeatureId: 3,
      lastUpdated: "2026-06-03T10:00:00.000Z",
      features: [
        {
          id: 1,
          slug: "issues-manager-cli",
          status: "in-progress",
          lastUpdated: "2026-06-03T10:00:00.000Z",
        },
        {
          id: 2,
          slug: "production-template-baseline",
          status: "todo",
          lastUpdated: "2026-06-02T10:00:00.000Z",
        },
      ],
    });

    const result = await runIssuesManagerCli(["get-feature"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Current feature");
    expect(result.stdout).toContain("issues-manager-cli");
    expect(result.stdout).toContain("in-progress");
    expect(result.stderr).toBe("");
  });

  it("fails with focus guidance when no feature is in progress", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "todo" },
        { id: 2, slug: "production-template-baseline", status: "archived" },
      ],
    });

    const result = await runIssuesManagerCli(["get-feature"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("No current feature");
    expect(result.stderr).toContain(
      "update-feature <slug> --status in-progress",
    );
    expect(result.stderr).toContain(
      "before running commands that depend on the current feature",
    );
  });

  it("fails with focus guidance when more than one feature is in progress", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "in-progress" },
        { id: 2, slug: "production-template-baseline", status: "in-progress" },
      ],
    });

    const result = await runIssuesManagerCli(["get-feature"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Ambiguous current feature");
    expect(result.stderr).toContain(
      "issues-manager-cli, production-template-baseline",
    );
    expect(result.stderr).toContain("update-feature");
    expect(result.stderr).toContain(
      "before running commands that depend on the current feature",
    );
  });

  it("updates a feature status explicitly without auto-demoting another feature", async () => {
    const workspacePath = await createWorkspace({
      version: "1",
      nextFeatureId: 3,
      features: [
        { id: 1, slug: "issues-manager-cli", status: "todo" },
        { id: 2, slug: "production-template-baseline", status: "archived" },
      ],
    });

    const result = await runIssuesManagerCli(
      ["update-feature", "issues-manager-cli", "--status", "in-progress"],
      {
        cwd: workspacePath,
      },
    );

    const persistedState = JSON.parse(
      await readFile(
        join(workspacePath, ".scratch", "features-status.json"),
        "utf8",
      ),
    ) as {
      features: Array<{ slug: string; status: string; lastUpdated?: string }>;
      lastUpdated?: string;
    };

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Updated feature");
    expect(result.stdout).toContain("issues-manager-cli");
    expect(result.stdout).toContain("in-progress");
    expect(
      persistedState.features.find(
        (feature) => feature.slug === "issues-manager-cli",
      )?.status,
    ).toBe("in-progress");
    expect(persistedState.lastUpdated).toEqual(expect.any(String));
  });

  it("refuses to activate a second feature while another feature is already in progress", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "in-progress" },
        { id: 2, slug: "production-template-baseline", status: "todo" },
      ],
    });

    const result = await runIssuesManagerCli(
      [
        "update-feature",
        "production-template-baseline",
        "--status",
        "in-progress",
      ],
      {
        cwd: workspacePath,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(
      'Cannot activate "production-template-baseline" while "issues-manager-cli" is already in-progress.',
    );
    expect(result.stderr).toContain(
      "First move the active feature out of in-progress",
    );
  });

  it("supports the real CLI entrypoint for feature inspection", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    const result = await execFileAsync(
      tsRuntime,
      [...tsRuntimeArgs, "get-feature"],
      {
        cwd: workspacePath,
      },
    );

    expect(result.stdout).toContain("Current feature");
    expect(result.stdout).toContain("issues-manager-cli");
    expect(result.stderr).toBe("");
  });

  it("supports the real CLI entrypoint for feature updates", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "todo" }],
    });

    const result = await execFileAsync(
      tsRuntime,
      [
        ...tsRuntimeArgs,
        "update-feature",
        "issues-manager-cli",
        "--status",
        "in-progress",
      ],
      {
        cwd: workspacePath,
      },
    );

    const persistedState = JSON.parse(
      await readFile(
        join(workspacePath, ".scratch", "features-status.json"),
        "utf8",
      ),
    ) as {
      features: Array<{ slug: string; status: string }>;
    };

    expect(result.stdout).toContain("Updated feature");
    expect(result.stdout).toContain("in-progress");
    expect(result.stderr).toBe("");
    expect(
      persistedState.features.find(
        (feature) => feature.slug === "issues-manager-cli",
      )?.status,
    ).toBe("in-progress");
  });

  it("supports the real CLI entrypoint for implicit issue inventory reads", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssuesState(workspacePath, "issues-manager-cli", {
      featureId: 1,
      featureSlug: "issues-manager-cli",
      featureStatus: "in-progress",
      issues: [
        {
          id: 2,
          title: "Derived inventory title",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 3,
          filePath:
            ".scratch/features/001-issues-manager-cli/issues/02-issue-inventory-for-a-feature.md",
        },
      ],
    });

    const result = await execFileAsync(
      tsRuntime,
      [...tsRuntimeArgs, "list-issues"],
      {
        cwd: workspacePath,
      },
    );

    expect(result.stdout).toContain("Feature issues");
    expect(result.stdout).toContain("slug: issues-manager-cli");
    expect(result.stdout).toContain("Derived inventory title");
    expect(result.stdout).toContain(
      ".scratch/features/001-issues-manager-cli/issues/02-issue-inventory-for-a-feature.md",
    );
    expect(result.stderr).toBe("");
  });

  it("supports the real CLI entrypoint for explicit issue inventory reads", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "in-progress" },
        { id: 2, slug: "production-template-baseline", status: "archived" },
        { id: 3, slug: "design-system", status: "in-progress" },
      ],
    });

    await writeIssuesState(workspacePath, "production-template-baseline", {
      featureId: 2,
      featureSlug: "production-template-baseline",
      featureStatus: "archived",
      issues: [
        {
          id: 17,
          title: "Derived documentation title",
          status: "ready-for-agent",
          method: "chore",
          complexity: 3,
          filePath:
            ".scratch/production-template-baseline/issues/17-documentation.md",
        },
      ],
    });

    const result = await execFileAsync(
      tsRuntime,
      [
        ...tsRuntimeArgs,
        "list-issues",
        "--feature",
        "production-template-baseline",
      ],
      {
        cwd: workspacePath,
      },
    );

    expect(result.stdout).toContain("Feature issues");
    expect(result.stdout).toContain("slug: production-template-baseline");
    expect(result.stdout).toContain("status: archived");
    expect(result.stdout).toContain("Derived documentation title");
    expect(result.stdout).toContain(
      ".scratch/production-template-baseline/issues/17-documentation.md",
    );
    expect(result.stderr).toBe("");
  });

  it("supports the real CLI entrypoint for actionable issue inventory reads", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssuesState(workspacePath, "issues-manager-cli", {
      featureId: 1,
      featureSlug: "issues-manager-cli",
      featureStatus: "in-progress",
      issues: [
        {
          id: 1,
          title: "Actionable issue",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 2,
          blockedBy: [2],
          filePath: ".scratch/features/001-issues-manager-cli/issues/01.md",
        },
        {
          id: 2,
          title: "Done blocker",
          status: "done",
          method: "tdd",
          complexity: 1,
          blockedBy: [],
          filePath: ".scratch/features/001-issues-manager-cli/issues/02.md",
        },
      ],
    });

    const result = await execFileAsync(
      tsRuntime,
      [...tsRuntimeArgs, "list-issues", "--actionable"],
      {
        cwd: workspacePath,
      },
    );

    expect(result.stdout).toContain("Feature issues (actionable)");
    expect(result.stdout).toContain("Actionable issue");
    expect(result.stdout).not.toContain("Done blocker");
    expect(result.stderr).toBe("");
  });

  it("supports the real CLI entrypoint for blocker updates", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssueMarkdown(
      workspacePath,
      1,
      "issues-manager-cli",
      "01-legacy.md",
      [
        "Status: ready-for-agent",
        "Method: tdd",
        "Complexity: 3",
        "",
        "# Legacy issue",
        "",
        "## Blocked by",
        "",
        "- `02-done`",
        "",
      ].join("\n"),
    );

    await writeIssueMarkdown(
      workspacePath,
      1,
      "issues-manager-cli",
      "02-done.md",
      [
        "Status: done",
        "Method: tdd",
        "Complexity: 2",
        "BlockedBy: none",
        "",
        "# Done dependency",
        "",
      ].join("\n"),
    );

    const result = await execFileAsync(
      tsRuntime,
      [...tsRuntimeArgs, "update-blockers", "1", "--blockers", "2"],
      {
        cwd: workspacePath,
      },
    );

    expect(result.stdout).toContain("Updated blockers");
    expect(result.stdout).toContain("issue: 1");
    expect(result.stdout).toContain("blockedBy: 2");
    expect(result.stderr).toBe("");
  });

  // --- get-issue --next smoke tests ---

  it("returns the next issue winner with feature metadata and issue path", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssuesState(workspacePath, "issues-manager-cli", {
      featureId: 1,
      featureSlug: "issues-manager-cli",
      featureStatus: "in-progress",
      issues: [
        {
          id: 1,
          title: "Done issue",
          status: "done",
          method: "tdd",
          complexity: 1,
          blockedBy: [],
          filePath: ".scratch/features/001-issues-manager-cli/issues/01.md",
        },
        {
          id: 2,
          title: "Next actionable",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 3,
          blockedBy: [],
          filePath: ".scratch/features/001-issues-manager-cli/issues/02.md",
        },
        {
          id: 3,
          title: "Higher complexity",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 5,
          blockedBy: [],
          filePath: ".scratch/features/001-issues-manager-cli/issues/03.md",
        },
      ],
    });

    const result = await runIssuesManagerCli(["get-issue", "--next"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Next issue");
    expect(result.stdout).toContain("feature: issues-manager-cli");
    expect(result.stdout).toContain("id: 2");
    expect(result.stdout).toContain("Next actionable");
    expect(result.stdout).toContain("complexity: 3");
    expect(result.stdout).toContain(
      ".scratch/features/001-issues-manager-cli/issues/02.md",
    );
  });

  it("returns empty no-winner as success when feature has no issues", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssuesState(workspacePath, "issues-manager-cli", {
      featureId: 1,
      featureSlug: "issues-manager-cli",
      featureStatus: "in-progress",
      issues: [],
    });

    const result = await runIssuesManagerCli(["get-issue", "--next"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("No issues found for this feature.");
    expect(result.stderr).toBe("");
  });

  it("returns complete no-winner as success when all issues are terminal", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssuesState(workspacePath, "issues-manager-cli", {
      featureId: 1,
      featureSlug: "issues-manager-cli",
      featureStatus: "in-progress",
      issues: [
        {
          id: 1,
          title: "Done",
          status: "done",
          method: "tdd",
          complexity: 1,
          blockedBy: [],
          filePath: ".scratch/features/001-issues-manager-cli/issues/01.md",
        },
        {
          id: 2,
          title: "Wontfix",
          status: "wontfix",
          method: "tdd",
          complexity: 2,
          blockedBy: [],
          filePath: ".scratch/features/001-issues-manager-cli/issues/02.md",
        },
      ],
    });

    const result = await runIssuesManagerCli(["get-issue", "--next"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("All issues are complete.");
    expect(result.stderr).toBe("");
  });

  it("returns no-actionable as non-zero when issues exist but none are actionable", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssuesState(workspacePath, "issues-manager-cli", {
      featureId: 1,
      featureSlug: "issues-manager-cli",
      featureStatus: "in-progress",
      issues: [
        {
          id: 1,
          title: "Blocked",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 1,
          blockedBy: [2],
          filePath: ".scratch/features/001-issues-manager-cli/issues/01.md",
        },
        {
          id: 2,
          title: "In-progress",
          status: "in-progress",
          method: "tdd",
          complexity: 2,
          blockedBy: [],
          filePath: ".scratch/features/001-issues-manager-cli/issues/02.md",
        },
      ],
    });

    const result = await runIssuesManagerCli(["get-issue", "--next"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("No actionable issues found");
  });

  it("supports explicit feature targeting on get-issue --next", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "in-progress" },
        { id: 2, slug: "other-feature", status: "todo" },
      ],
    });

    await writeIssuesState(workspacePath, "other-feature", {
      featureId: 2,
      featureSlug: "other-feature",
      featureStatus: "todo",
      issues: [
        {
          id: 1,
          title: "Explicit target issue",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 2,
          blockedBy: [],
          filePath: ".scratch/other-feature/issues/01.md",
        },
      ],
    });

    const result = await runIssuesManagerCli(
      ["get-issue", "--next", "--feature", "other-feature"],
      { cwd: workspacePath },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Next issue");
    expect(result.stdout).toContain("feature: other-feature");
    expect(result.stdout).toContain("Explicit target issue");
    expect(result.stdout).toContain(".scratch/other-feature/issues/01.md");
  });

  // --- update-status smoke tests ---

  it("updates issue status and verifies markdown was updated", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssueMarkdown(
      workspacePath,
      1,
      "issues-manager-cli",
      "02-example.md",
      [
        "Status: ready-for-agent",
        "Method: tdd",
        "Complexity: 3",
        "BlockedBy: none",
        "",
        "# Example",
        "",
      ].join("\n"),
    );

    const result = await runIssuesManagerCli(
      ["update-status", "2", "--status", "in-progress"],
      { cwd: workspacePath },
    );

    const updatedMarkdown = await readFile(
      join(
        workspacePath,
        ".scratch",
        "features",
        "001-issues-manager-cli",
        "issues",
        "02-example.md",
      ),
      "utf8",
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Updated status");
    expect(result.stdout).toContain("feature: issues-manager-cli");
    expect(result.stdout).toContain("issue: 2");
    expect(result.stdout).toContain("status: in-progress");
    expect(result.stdout).toContain("issues/02-example.md");
    expect(updatedMarkdown).toContain("Status: in-progress");
  });

  it("fails update-status with an invalid transition", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssueMarkdown(
      workspacePath,
      1,
      "issues-manager-cli",
      "02-example.md",
      [
        "Status: ready-for-agent",
        "Method: tdd",
        "Complexity: 3",
        "BlockedBy: none",
        "",
        "# Example",
        "",
      ].join("\n"),
    );

    const result = await runIssuesManagerCli(
      ["update-status", "2", "--status", "done"],
      { cwd: workspacePath },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Invalid transition");
  });

  it("succeeds update-status with --force", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssueMarkdown(
      workspacePath,
      1,
      "issues-manager-cli",
      "02-example.md",
      [
        "Status: ready-for-agent",
        "Method: tdd",
        "Complexity: 3",
        "BlockedBy: none",
        "",
        "# Example",
        "",
      ].join("\n"),
    );

    const result = await runIssuesManagerCli(
      ["update-status", "2", "--status", "done", "--force"],
      { cwd: workspacePath },
    );

    const updatedMarkdown = await readFile(
      join(
        workspacePath,
        ".scratch",
        "features",
        "001-issues-manager-cli",
        "issues",
        "02-example.md",
      ),
      "utf8",
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Updated status");
    expect(updatedMarkdown).toContain("Status: done");
  });

  it("rejects invalid status vocabulary even with --force", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    await writeIssueMarkdown(
      workspacePath,
      1,
      "issues-manager-cli",
      "02-example.md",
      [
        "Status: ready-for-agent",
        "Method: tdd",
        "Complexity: 3",
        "BlockedBy: none",
        "",
        "# Example",
        "",
      ].join("\n"),
    );

    const result = await runIssuesManagerCli(
      ["update-status", "2", "--status", "invalid", "--force"],
      { cwd: workspacePath },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Invalid status");
  });

  it("shows usage error when --status is missing", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    const result = await runIssuesManagerCli(["update-status", "2"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Usage: update-status");
  });

  // --- milestone flag tests ---

  it("update-feature <slug> --milestone 1 succeeds and writes milestone", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "test-feature", status: "todo" }],
    });

    const result = await runIssuesManagerCli(
      ["update-feature", "test-feature", "--milestone", "1"],
      { cwd: workspacePath },
    );

    const persistedState = JSON.parse(
      await readFile(
        join(workspacePath, ".scratch", "features-status.json"),
        "utf8",
      ),
    ) as {
      features: Array<{ slug: string; status: string; milestone?: number }>;
    };

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Updated feature");
    expect(result.stdout).toContain("milestone: 1");
    expect(
      persistedState.features.find((f) => f.slug === "test-feature")?.milestone,
    ).toBe(1);
  });

  it("update-feature <slug> --milestone 0 fails with validation error", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "test-feature", status: "todo" }],
    });

    const result = await runIssuesManagerCli(
      ["update-feature", "test-feature", "--milestone", "0"],
      { cwd: workspacePath },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("milestone");
  });

  it("update-feature <slug> --milestone abc fails with validation error", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "test-feature", status: "todo" }],
    });

    const result = await runIssuesManagerCli(
      ["update-feature", "test-feature", "--milestone", "abc"],
      { cwd: workspacePath },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("milestone");
  });

  it("update-feature <slug> --status in-progress preserves existing milestone", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "test-feature", status: "todo", milestone: 3 }],
    });

    const result = await runIssuesManagerCli(
      ["update-feature", "test-feature", "--status", "in-progress"],
      { cwd: workspacePath },
    );

    const persistedState = JSON.parse(
      await readFile(
        join(workspacePath, ".scratch", "features-status.json"),
        "utf8",
      ),
    ) as {
      features: Array<{ slug: string; status: string; milestone?: number }>;
    };

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(
      persistedState.features.find((f) => f.slug === "test-feature")?.milestone,
    ).toBe(3);
  });

  it("update-feature <slug> --status in-progress --milestone 2 updates both", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "test-feature", status: "todo" }],
    });

    const result = await runIssuesManagerCli(
      [
        "update-feature",
        "test-feature",
        "--status",
        "in-progress",
        "--milestone",
        "2",
      ],
      { cwd: workspacePath },
    );

    const persistedState = JSON.parse(
      await readFile(
        join(workspacePath, ".scratch", "features-status.json"),
        "utf8",
      ),
    ) as {
      features: Array<{ slug: string; status: string; milestone?: number }>;
    };

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("in-progress");
    expect(result.stdout).toContain("milestone: 2");
    expect(
      persistedState.features.find((f) => f.slug === "test-feature")?.status,
    ).toBe("in-progress");
    expect(
      persistedState.features.find((f) => f.slug === "test-feature")?.milestone,
    ).toBe(2);
  });
});

describe("status command", () => {
  it("returns 'No features registered.' when no features exist", async () => {
    const workspacePath = await createWorkspace({
      features: [],
    });

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("No features registered.");
    expect(result.stderr).toBe("");
  });

  it("shows milestone summary with not-started status", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "alpha", status: "todo", milestone: 1 },
        { id: 2, slug: "beta", status: "todo", milestone: 1 },
      ],
    });

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("=== Milestones ===");
    expect(result.stdout).toContain(
      "M1  | 0/2 done  | 0 in-progress  | not-started",
    );
  });

  it("shows milestone with in-progress status", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "alpha", status: "in-progress", milestone: 1 },
        { id: 2, slug: "beta", status: "todo", milestone: 1 },
      ],
    });

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(
      "M1  | 0/2 done  | 1 in-progress  | in-progress",
    );
  });

  it("shows milestone with done status", async () => {
    const workspacePath = await createWorkspace({
      features: [
        {
          id: 1,
          slug: "alpha",
          status: "archived",
          finalStatus: "done",
          milestone: 1,
        },
      ],
    });

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("M1  | 1/1 done  | 0 in-progress  | done");
  });

  it("warns about multiple active milestones", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "a", status: "in-progress", milestone: 1 },
        { id: 2, slug: "b", status: "in-progress", milestone: 2 },
      ],
    });

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain(
      "⚠ Multiple milestones have in-progress features",
    );
  });

  it("warns about features without milestone", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "no-mile", status: "todo" }],
    });

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain(
      "⚠ 1 feature(s) have no milestone assigned",
    );
  });

  it("shows full pipeline state for a feature with all artifacts", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "test-feature", status: "in-progress", milestone: 1 },
      ],
    });

    const featureDir = join(
      workspacePath,
      ".scratch",
      "features",
      "001-test-feature",
    );

    await mkdir(join(featureDir, "issues"), { recursive: true });
    await mkdir(join(featureDir, "reviews"), { recursive: true });
    await writeFile(join(featureDir, "GRILL_SESSION.md"), "# Grill", "utf8");
    await writeFile(join(featureDir, "BRIEF.md"), "# Brief", "utf8");
    await writeFile(join(featureDir, "PRD.md"), "# PRD", "utf8");
    await writeFile(join(featureDir, "issues", "01-some-issue.md"), "", "utf8");
    await writeFile(join(featureDir, "reviews", "01-review.md"), "", "utf8");
    await writeFile(
      join(featureDir, "issues-status.json"),
      JSON.stringify({
        issues: [
          { id: 1, status: "done" },
          { id: 2, status: "done" },
          { id: 3, status: "in-progress" },
        ],
      }),
      "utf8",
    );

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("- Has Grill Session: true");
    expect(result.stdout).toContain("- Has Brief: true");
    expect(result.stdout).toContain("- Has PRD: true");
    expect(result.stdout).toContain("- Has issues: true");
    expect(result.stdout).toContain("- completed issues: 2/3");
    expect(result.stdout).toContain("- AI Review Passed: true");
    expect(result.stdout).toContain("- Human Review Passed: false");
  });

  it("shows pipeline state with no artifacts as all false", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "empty-feature", status: "todo", milestone: 1 },
      ],
    });

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("- Has Grill Session: false");
    expect(result.stdout).toContain("- Has Brief: false");
    expect(result.stdout).toContain("- Has PRD: false");
    expect(result.stdout).toContain("- Has issues: false");
    expect(result.stdout).toContain("- completed issues: —");
    expect(result.stdout).toContain("- AI Review Passed: false");
    expect(result.stdout).toContain("- Human Review Passed: false");
  });

  it("shows Human Review Passed true for archived + done", async () => {
    const workspacePath = await createWorkspace({
      features: [
        {
          id: 1,
          slug: "done-feature",
          status: "archived",
          finalStatus: "done",
          milestone: 1,
        },
      ],
    });

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("- Human Review Passed: true");
  });

  it("shows completed issues as dash when issues-status.json missing", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "no-state", status: "todo", milestone: 1 }],
    });

    // No issues dir, no issues-status.json
    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("- completed issues: —");
  });

  // --- Issue breakdown tests ---

  it("shows issue breakdown for in-progress feature with issues", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "test-feature", status: "in-progress", milestone: 1 },
      ],
    });

    const featureDir = join(
      workspacePath,
      ".scratch",
      "features",
      "001-test-feature",
    );

    await mkdir(join(featureDir, "issues"), { recursive: true });
    await writeFile(join(featureDir, "issues", "01-some-issue.md"), "", "utf8");
    await writeFile(
      join(featureDir, "issues-status.json"),
      JSON.stringify({
        featureId: 1,
        featureSlug: "test-feature",
        featureStatus: "in-progress",
        issues: [
          {
            id: 1,
            title: "Fix config aliases",
            status: "done",
            method: "chore",
            complexity: 2,
            blockedBy: [],
            filePath: ".scratch/features/001-test-feature/issues/01.md",
          },
          {
            id: 2,
            title: "Version pinning audit",
            status: "done",
            method: "tdd",
            complexity: 3,
            blockedBy: [],
            filePath: ".scratch/features/001-test-feature/issues/02.md",
          },
          {
            id: 4,
            title: "Local CMS foundation",
            status: "ready-for-agent",
            method: "tdd",
            complexity: 4,
            blockedBy: [2],
            filePath: ".scratch/features/001-test-feature/issues/04.md",
          },
        ],
      }),
      "utf8",
    );

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("  - Issues:");
    expect(result.stdout).toContain("    - #01 Fix config aliases  [done]");
    expect(result.stdout).toContain("    - #02 Version pinning audit  [done]");
    expect(result.stdout).toContain(
      "    - #04 Local CMS foundation  [ready-for-agent]",
    );
  });

  it("shows Issues: none for in-progress feature with no issues-status.json", async () => {
    const workspacePath = await createWorkspace({
      features: [
        {
          id: 1,
          slug: "no-issues-feature",
          status: "in-progress",
          milestone: 1,
        },
      ],
    });

    // No issues dir, no issues-status.json — just the feature registered
    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("  - Issues: none");
  });

  it("shows Issues: none for in-progress feature with empty issues array", async () => {
    const workspacePath = await createWorkspace({
      features: [
        { id: 1, slug: "empty-issues", status: "in-progress", milestone: 1 },
      ],
    });

    const featureDir = join(
      workspacePath,
      ".scratch",
      "features",
      "001-empty-issues",
    );

    await mkdir(join(featureDir, "issues"), { recursive: true });
    await writeFile(join(featureDir, "issues", "01-issue.md"), "", "utf8");
    await writeFile(
      join(featureDir, "issues-status.json"),
      JSON.stringify({
        featureId: 1,
        featureSlug: "empty-issues",
        featureStatus: "in-progress",
        issues: [],
      }),
      "utf8",
    );

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("  - Issues: none");
  });

  it("does not show issue breakdown for todo feature with issues", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "todo-feature", status: "todo", milestone: 1 }],
    });

    const featureDir = join(
      workspacePath,
      ".scratch",
      "features",
      "001-todo-feature",
    );

    await mkdir(join(featureDir, "issues"), { recursive: true });
    await writeFile(join(featureDir, "issues", "01-some-issue.md"), "", "utf8");
    await writeFile(
      join(featureDir, "issues-status.json"),
      JSON.stringify({
        featureId: 1,
        featureSlug: "todo-feature",
        featureStatus: "todo",
        issues: [
          {
            id: 1,
            title: "Some issue",
            status: "ready-for-agent",
            method: "tdd",
            complexity: 2,
            blockedBy: [],
            filePath: ".scratch/features/001-todo-feature/issues/01.md",
          },
        ],
      }),
      "utf8",
    );

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain("  - Issues:");
    expect(result.stdout).not.toContain("    - #01");
  });

  it("does not show issue breakdown for archived feature with issues", async () => {
    const workspacePath = await createWorkspace({
      features: [
        {
          id: 1,
          slug: "archived-feature",
          status: "archived",
          finalStatus: "done",
          milestone: 1,
        },
      ],
    });

    const featureDir = join(
      workspacePath,
      ".scratch",
      "features",
      "001-archived-feature",
    );

    await mkdir(join(featureDir, "issues"), { recursive: true });
    await writeFile(join(featureDir, "issues", "01-issue.md"), "", "utf8");
    await writeFile(
      join(featureDir, "issues-status.json"),
      JSON.stringify({
        featureId: 1,
        featureSlug: "archived-feature",
        featureStatus: "archived",
        issues: [
          {
            id: 1,
            title: "Done issue",
            status: "done",
            method: "tdd",
            complexity: 1,
            blockedBy: [],
            filePath: ".scratch/features/001-archived-feature/issues/01.md",
          },
        ],
      }),
      "utf8",
    );

    const result = await runIssuesManagerCli(["status"], {
      cwd: workspacePath,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain("  - Issues:");
    expect(result.stdout).not.toContain("    - #01");
  });
});
