// @vitest-environment node

import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";
import { runIssuesManagerCli } from "@/issues-manager-cli/cli";

const workspaces: string[] = [];
const execFileAsync = promisify(execFile);
const binPath = join(process.cwd(), "src", "issues-manager-cli", "bin.mjs");

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
  issuesState: object,
) {
  await writeIssuesStateFile(
    workspacePath,
    featureSlug,
    JSON.stringify(issuesState, null, 2),
  );
}

async function writeIssuesStateFile(
  workspacePath: string,
  featureSlug: string,
  contents: string,
) {
  const featurePath = join(workspacePath, ".scratch", featureSlug);

  await mkdir(featurePath, { recursive: true });
  await writeFile(join(featurePath, "issues-status.json"), contents, "utf8");
}

afterEach(async () => {
  await Promise.all(workspaces.splice(0).map((path) => rm(path, { recursive: true, force: true })));
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
            ".scratch/issues-manager-cli/issues/01-feature-scope-inspection-and-activation.md",
        },
        {
          id: 2,
          title: "Derived inventory title",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 3,
          filePath:
            ".scratch/issues-manager-cli/issues/02-issue-inventory-for-a-feature.md",
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
      ".scratch/issues-manager-cli/issues/01-feature-scope-inspection-and-activation.md",
    );
    expect(result.stdout).toContain(
      ".scratch/issues-manager-cli/issues/02-issue-inventory-for-a-feature.md",
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
          filePath: ".scratch/production-template-baseline/issues/17-documentation.md",
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
      ".scratch/issues-manager-cli/issues-status.json",
    );
  });

  it("fails descriptively when the derived issue state is malformed", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "todo" }],
    });

    await writeIssuesStateFile(workspacePath, "issues-manager-cli", "not json\n");

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
      ".scratch/issues-manager-cli/issues-status.json",
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
    expect(result.stderr).toContain("issues-manager-cli, production-template-baseline");
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
      await readFile(join(workspacePath, ".scratch", "features-status.json"), "utf8"),
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
      persistedState.features.find((feature) => feature.slug === "issues-manager-cli")
        ?.status,
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
    expect(result.stderr).toContain("First move the active feature out of in-progress");
  });

  it("supports the real CLI entrypoint for feature inspection", async () => {
    const workspacePath = await createWorkspace({
      features: [{ id: 1, slug: "issues-manager-cli", status: "in-progress" }],
    });

    const result = await execFileAsync(
      "node",
      [
        "--no-warnings",
        "--experimental-strip-types",
        binPath,
        "get-feature",
      ],
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
      "node",
      [
        "--no-warnings",
        "--experimental-strip-types",
        binPath,
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
      await readFile(join(workspacePath, ".scratch", "features-status.json"), "utf8"),
    ) as {
      features: Array<{ slug: string; status: string }>;
    };

    expect(result.stdout).toContain("Updated feature");
    expect(result.stdout).toContain("in-progress");
    expect(result.stderr).toBe("");
    expect(
      persistedState.features.find((feature) => feature.slug === "issues-manager-cli")
        ?.status,
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
            ".scratch/issues-manager-cli/issues/02-issue-inventory-for-a-feature.md",
        },
      ],
    });

    const result = await execFileAsync(
      "node",
      [
        "--no-warnings",
        "--experimental-strip-types",
        binPath,
        "list-issues",
      ],
      {
        cwd: workspacePath,
      },
    );

    expect(result.stdout).toContain("Feature issues");
    expect(result.stdout).toContain("slug: issues-manager-cli");
    expect(result.stdout).toContain("Derived inventory title");
    expect(result.stdout).toContain(
      ".scratch/issues-manager-cli/issues/02-issue-inventory-for-a-feature.md",
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
          filePath: ".scratch/production-template-baseline/issues/17-documentation.md",
        },
      ],
    });

    const result = await execFileAsync(
      "node",
      [
        "--no-warnings",
        "--experimental-strip-types",
        binPath,
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
});