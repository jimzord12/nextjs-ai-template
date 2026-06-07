// @vitest-environment node

import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateFeaturesState } from "@/issues-manager-cli/features-state";
import {
  getActionableIssues,
  type IssuesState,
  regenerateIssuesStateFromIssueFiles,
  resolveFeatureForIssueRead,
  selectNextIssue,
  updateIssueBlockers,
  updateIssueStatus,
  VALID_STATUSES,
  validateIssuesState,
  validateStatusTransition,
} from "@/issues-manager-cli/issues-state";

describe("resolveFeatureForIssueRead", () => {
  it("returns the current feature when no explicit target is provided", () => {
    const state = validateFeaturesState({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "in-progress" },
        { id: 2, slug: "production-template-baseline", status: "todo" },
      ],
    });

    expect(resolveFeatureForIssueRead(state)).toEqual({
      id: 1,
      slug: "issues-manager-cli",
      status: "in-progress",
      lastUpdated: undefined,
      finalStatus: undefined,
    });
  });

  it("returns an explicit feature target without resolving the current feature", () => {
    const state = validateFeaturesState({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "in-progress" },
        { id: 2, slug: "production-template-baseline", status: "archived" },
        { id: 3, slug: "design-system", status: "in-progress" },
      ],
    });

    expect(
      resolveFeatureForIssueRead(state, "production-template-baseline"),
    ).toEqual({
      id: 2,
      slug: "production-template-baseline",
      status: "archived",
      lastUpdated: undefined,
      finalStatus: undefined,
    });
  });
});

describe("validateIssuesState", () => {
  it("fails when the derived issue state does not include an issues array", () => {
    expect(() =>
      validateIssuesState({
        featureId: 1,
        featureSlug: "issues-manager-cli",
      }),
    ).toThrowError(/Expected "issues" to be an array\./);
  });

  it("fails with canonical blocker guidance when blockedBy is missing", () => {
    expect(() =>
      validateIssuesState({
        featureId: 1,
        featureSlug: "issues-manager-cli",
        issues: [
          {
            id: 1,
            title: "Issue inventory",
            status: "ready-for-agent",
            method: "tdd",
            complexity: 3,
            filePath: ".scratch/issues-manager-cli/issues/01.md",
          },
        ],
      }),
    ).toThrowError(/legacy prose-only blockers/i);
  });

  it("fails when a derived issue record is missing its file path", () => {
    expect(() =>
      validateIssuesState({
        featureId: 1,
        featureSlug: "issues-manager-cli",
        issues: [
          {
            id: 1,
            title: "Issue inventory",
            status: "ready-for-agent",
            method: "tdd",
            complexity: 3,
            blockedBy: [],
          },
        ],
      }),
    ).toThrowError(/Expected a non-empty filePath\./);
  });

  it("fails when an issue references itself as a blocker", () => {
    expect(() =>
      validateIssuesState({
        featureId: 1,
        featureSlug: "issues-manager-cli",
        issues: [
          {
            id: 7,
            title: "Self blocked issue",
            status: "ready-for-agent",
            method: "tdd",
            complexity: 3,
            blockedBy: [7],
            filePath: ".scratch/issues-manager-cli/issues/07.md",
          },
        ],
      }),
    ).toThrowError(/cannot block itself/i);
  });

  it("fails when an issue has duplicate blocker ids", () => {
    expect(() =>
      validateIssuesState({
        featureId: 1,
        featureSlug: "issues-manager-cli",
        issues: [
          {
            id: 1,
            title: "Parent issue",
            status: "done",
            method: "tdd",
            complexity: 2,
            blockedBy: [],
            filePath: ".scratch/issues-manager-cli/issues/01.md",
          },
          {
            id: 2,
            title: "Duplicate blockers",
            status: "ready-for-agent",
            method: "tdd",
            complexity: 3,
            blockedBy: [1, 1],
            filePath: ".scratch/issues-manager-cli/issues/02.md",
          },
        ],
      }),
    ).toThrowError(/duplicate blocker ids/i);
  });

  it("fails when an issue references a missing blocker id", () => {
    expect(() =>
      validateIssuesState({
        featureId: 1,
        featureSlug: "issues-manager-cli",
        issues: [
          {
            id: 1,
            title: "Known issue",
            status: "done",
            method: "tdd",
            complexity: 2,
            blockedBy: [],
            filePath: ".scratch/issues-manager-cli/issues/01.md",
          },
          {
            id: 2,
            title: "Missing blocker reference",
            status: "ready-for-agent",
            method: "tdd",
            complexity: 3,
            blockedBy: [99],
            filePath: ".scratch/issues-manager-cli/issues/02.md",
          },
        ],
      }),
    ).toThrowError(/unknown blocker id/i);
  });
});

describe("getActionableIssues", () => {
  it("excludes ready-for-agent issues blocked by unresolved blockers", () => {
    const state = validateIssuesState({
      featureId: 1,
      featureSlug: "issues-manager-cli",
      issues: [
        {
          id: 1,
          title: "Blocked by in-progress dependency",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 2,
          blockedBy: [2],
          filePath: ".scratch/issues-manager-cli/issues/01.md",
        },
        {
          id: 2,
          title: "Dependency still open",
          status: "in-progress",
          method: "tdd",
          complexity: 2,
          blockedBy: [],
          filePath: ".scratch/issues-manager-cli/issues/02.md",
        },
      ],
    });

    expect(getActionableIssues(state)).toEqual([]);
  });

  it("keeps issues blocked when blocker status is wontfix", () => {
    const state = validateIssuesState({
      featureId: 1,
      featureSlug: "issues-manager-cli",
      issues: [
        {
          id: 1,
          title: "Blocked issue",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 2,
          blockedBy: [2],
          filePath: ".scratch/issues-manager-cli/issues/01.md",
        },
        {
          id: 2,
          title: "Cancelled blocker",
          status: "wontfix",
          method: "tdd",
          complexity: 2,
          blockedBy: [],
          filePath: ".scratch/issues-manager-cli/issues/02.md",
        },
      ],
    });

    expect(getActionableIssues(state)).toEqual([]);
  });

  it("includes ready-for-agent issues when all blockers are done", () => {
    const state = validateIssuesState({
      featureId: 1,
      featureSlug: "issues-manager-cli",
      issues: [
        {
          id: 1,
          title: "Now unblocked issue",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 2,
          blockedBy: [2],
          filePath: ".scratch/issues-manager-cli/issues/01.md",
        },
        {
          id: 2,
          title: "Finished blocker",
          status: "done",
          method: "tdd",
          complexity: 2,
          blockedBy: [],
          filePath: ".scratch/issues-manager-cli/issues/02.md",
        },
      ],
    });

    expect(getActionableIssues(state).map((issue) => issue.id)).toEqual([1]);
  });
});

describe("issue markdown regeneration and normalization", () => {
  it("fails regeneration when any issue still uses a legacy prose-only blocker section", async () => {
    const workspacePath = await mkdtemp(
      join(tmpdir(), "issues-manager-cli-domain-"),
    );

    try {
      const issuesDir = join(
        workspacePath,
        ".scratch",
        "issues-manager-cli",
        "issues",
      );
      await mkdir(issuesDir, { recursive: true });

      await writeFile(
        join(issuesDir, "01-example.md"),
        [
          "Status: ready-for-agent",
          "Method: tdd",
          "Complexity: 3",
          "",
          "# Example",
          "",
          "## Blocked by",
          "",
          "- `02-other`",
          "",
        ].join("\n"),
        "utf8",
      );

      await expect(
        regenerateIssuesStateFromIssueFiles({
          cwd: workspacePath,
          feature: {
            id: 1,
            slug: "issues-manager-cli",
            status: "in-progress",
          },
        }),
      ).rejects.toThrowError(/legacy prose-only blocker section/i);
    } finally {
      await rm(workspacePath, { recursive: true, force: true });
    }
  });

  it("updateIssueBlockers normalizes a legacy issue to canonical BlockedBy metadata", async () => {
    const workspacePath = await mkdtemp(
      join(tmpdir(), "issues-manager-cli-domain-"),
    );

    try {
      const issuesDir = join(
        workspacePath,
        ".scratch",
        "issues-manager-cli",
        "issues",
      );
      await mkdir(issuesDir, { recursive: true });

      await writeFile(
        join(issuesDir, "01-legacy.md"),
        [
          "Status: ready-for-agent",
          "Method: tdd",
          "Complexity: 3",
          "",
          "# Legacy blocker issue",
          "",
          "## Blocked by",
          "",
          "- `02-other`",
          "",
        ].join("\n"),
        "utf8",
      );

      await writeFile(
        join(issuesDir, "02-done.md"),
        [
          "Status: done",
          "Method: tdd",
          "Complexity: 2",
          "BlockedBy: none",
          "",
          "# Done dependency",
          "",
        ].join("\n"),
        "utf8",
      );

      const update = await updateIssueBlockers({
        cwd: workspacePath,
        feature: {
          id: 1,
          slug: "issues-manager-cli",
          status: "in-progress",
        },
        issueId: 1,
        blockedBy: [2],
      });

      const updatedMarkdown = await readFile(
        join(issuesDir, "01-legacy.md"),
        "utf8",
      );

      expect(update.blockedBy).toEqual([2]);
      expect(updatedMarkdown).toContain("BlockedBy: 2");
      expect(updatedMarkdown).not.toContain("## Blocked by");
      expect(
        update.issuesState.issues.find((issue) => issue.id === 1)?.blockedBy,
      ).toEqual([2]);
    } finally {
      await rm(workspacePath, { recursive: true, force: true });
    }
  });
});
describe("selectNextIssue", () => {
  it("selects the issue with lowest complexity, then lowest id as tiebreaker", () => {
    const state: IssuesState = {
      featureId: 1,
      featureSlug: "test-feature",
      issues: [
        {
          id: 3,
          title: "Complex task",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 5,
          blockedBy: [],
          filePath: ".scratch/test-feature/issues/03.md",
        },
        {
          id: 1,
          title: "Medium task",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 3,
          blockedBy: [],
          filePath: ".scratch/test-feature/issues/01.md",
        },
        {
          id: 2,
          title: "Also medium task",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 3,
          blockedBy: [],
          filePath: ".scratch/test-feature/issues/02.md",
        },
      ],
    };
    const result = selectNextIssue(state);
    expect(result).toEqual({
      kind: "winner",
      issue: expect.objectContaining({ id: 1, title: "Medium task" }),
    });
  });
  it("returns no-winner/empty when issues array is empty", () => {
    const state: IssuesState = {
      featureId: 1,
      featureSlug: "test-feature",
      issues: [],
    };
    const result = selectNextIssue(state);
    expect(result).toEqual({ kind: "no-winner", reason: "empty" });
  });
  it("returns no-winner/complete when all issues have terminal statuses", () => {
    const state: IssuesState = {
      featureId: 1,
      featureSlug: "test-feature",
      issues: [
        {
          id: 1,
          title: "Done issue",
          status: "done",
          method: "tdd",
          complexity: 1,
          blockedBy: [],
          filePath: ".scratch/test-feature/issues/01.md",
        },
        {
          id: 2,
          title: "Wontfix issue",
          status: "wontfix",
          method: "tdd",
          complexity: 2,
          blockedBy: [],
          filePath: ".scratch/test-feature/issues/02.md",
        },
      ],
    };
    const result = selectNextIssue(state);
    expect(result).toEqual({ kind: "no-winner", reason: "complete" });
  });
  it("returns no-winner/no-actionable when issues exist but none are actionable", () => {
    const state: IssuesState = {
      featureId: 1,
      featureSlug: "test-feature",
      issues: [
        {
          id: 1,
          title: "Blocked issue",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 1,
          blockedBy: [2],
          filePath: ".scratch/test-feature/issues/01.md",
        },
        {
          id: 2,
          title: "In-progress issue",
          status: "in-progress",
          method: "tdd",
          complexity: 2,
          blockedBy: [],
          filePath: ".scratch/test-feature/issues/02.md",
        },
      ],
    };
    const result = selectNextIssue(state);
    expect(result).toEqual({ kind: "no-winner", reason: "no-actionable" });
  });
  it("returns the correct winner among actionable issues", () => {
    const state: IssuesState = {
      featureId: 1,
      featureSlug: "test-feature",
      issues: [
        {
          id: 1,
          title: "In-progress issue",
          status: "in-progress",
          method: "tdd",
          complexity: 1,
          blockedBy: [],
          filePath: ".scratch/test-feature/issues/01.md",
        },
        {
          id: 2,
          title: "Actionable low complexity",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 2,
          blockedBy: [],
          filePath: ".scratch/test-feature/issues/02.md",
        },
        {
          id: 3,
          title: "Blocked issue",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 1,
          blockedBy: [1],
          filePath: ".scratch/test-feature/issues/03.md",
        },
        {
          id: 4,
          title: "Actionable high complexity",
          status: "ready-for-agent",
          method: "tdd",
          complexity: 5,
          blockedBy: [],
          filePath: ".scratch/test-feature/issues/04.md",
        },
      ],
    };
    const result = selectNextIssue(state);
    expect(result).toEqual({
      kind: "winner",
      issue: expect.objectContaining({
        id: 2,
        title: "Actionable low complexity",
      }),
    });
  });
});

describe("validateStatusTransition", () => {
  it("accepts a valid transition from ready-for-agent to in-progress", () => {
    expect(() =>
      validateStatusTransition("ready-for-agent", "in-progress"),
    ).not.toThrow();
  });

  it("rejects an invalid transition from ready-for-agent to done", () => {
    expect(() =>
      validateStatusTransition("ready-for-agent", "done"),
    ).toThrowError(/invalid transition/i);
  });

  it("allows force to bypass the transition graph", () => {
    expect(() =>
      validateStatusTransition("ready-for-agent", "done", { force: true }),
    ).not.toThrow();
  });

  it("rejects invalid status vocabulary even with force", () => {
    expect(() =>
      validateStatusTransition("ready-for-agent", "invalid-status", {
        force: true,
      }),
    ).toThrowError(/invalid status/i);
  });

  it("rejects a normal transition from a terminal status", () => {
    expect(() =>
      validateStatusTransition("done", "ready-for-agent"),
    ).toThrowError(/invalid transition/i);
  });

  it("rejects a same-status no-op transition", () => {
    expect(() =>
      validateStatusTransition("ready-for-agent", "ready-for-agent"),
    ).toThrowError(/no-op/i);
  });

  it("contains the expected statuses in VALID_STATUSES", () => {
    expect(VALID_STATUSES).toEqual(
      expect.arrayContaining([
        "needs-triage",
        "needs-info",
        "ready-for-agent",
        "ready-for-human",
        "in-progress",
        "done",
        "wontfix",
      ]),
    );
  });
});

describe("updateIssueStatus", () => {
  it("updates status in markdown and regenerates derived state", async () => {
    const workspacePath = await mkdtemp(
      join(tmpdir(), "issues-manager-cli-domain-"),
    );

    try {
      const issuesDir = join(
        workspacePath,
        ".scratch",
        "issues-manager-cli",
        "issues",
      );
      await mkdir(issuesDir, { recursive: true });

      await writeFile(
        join(workspacePath, ".scratch", "features-status.json"),
        `${JSON.stringify(
          {
            features: [
              { id: 1, slug: "issues-manager-cli", status: "in-progress" },
            ],
          },
          null,
          2,
        )}\n`,
        "utf8",
      );

      await writeFile(
        join(issuesDir, "02-example.md"),
        [
          "Status: ready-for-agent",
          "Method: tdd",
          "Complexity: 3",
          "BlockedBy: none",
          "",
          "# Example",
          "",
        ].join("\n"),
        "utf8",
      );

      const feature = {
        id: 1,
        slug: "issues-manager-cli",
        status: "in-progress" as const,
      };

      const result = await updateIssueStatus({
        cwd: workspacePath,
        feature,
        issueId: 2,
        status: "in-progress",
      });

      const updatedMarkdown = await readFile(
        join(issuesDir, "02-example.md"),
        "utf8",
      );
      const regenerated = JSON.parse(
        await readFile(
          join(
            workspacePath,
            ".scratch",
            "issues-manager-cli",
            "issues-status.json",
          ),
          "utf8",
        ),
      ) as { issues: Array<{ id: number; status: string }> };

      expect(result.issueId).toBe(2);
      expect(result.status).toBe("in-progress");
      expect(result.featureSlug).toBe("issues-manager-cli");
      expect(updatedMarkdown).toContain("Status: in-progress");
      expect(updatedMarkdown).not.toContain("Status: ready-for-agent");
      expect(regenerated.issues.find((issue) => issue.id === 2)?.status).toBe(
        "in-progress",
      );
    } finally {
      await rm(workspacePath, { recursive: true, force: true });
    }
  });

  it("rejects an invalid transition before writing", async () => {
    const workspacePath = await mkdtemp(
      join(tmpdir(), "issues-manager-cli-domain-"),
    );

    try {
      const issuesDir = join(
        workspacePath,
        ".scratch",
        "issues-manager-cli",
        "issues",
      );
      await mkdir(issuesDir, { recursive: true });

      const content = [
        "Status: ready-for-agent",
        "Method: tdd",
        "Complexity: 3",
        "BlockedBy: none",
        "",
        "# Example",
        "",
      ].join("\n");

      await writeFile(join(issuesDir, "02-example.md"), content, "utf8");

      await expect(
        updateIssueStatus({
          cwd: workspacePath,
          feature: {
            id: 1,
            slug: "issues-manager-cli",
            status: "in-progress",
          },
          issueId: 2,
          status: "done",
        }),
      ).rejects.toThrowError(/invalid transition/i);

      const unchanged = await readFile(
        join(issuesDir, "02-example.md"),
        "utf8",
      );
      expect(unchanged).toBe(content);
    } finally {
      await rm(workspacePath, { recursive: true, force: true });
    }
  });

  it("bypasses the transition graph with force", async () => {
    const workspacePath = await mkdtemp(
      join(tmpdir(), "issues-manager-cli-domain-"),
    );

    try {
      const issuesDir = join(
        workspacePath,
        ".scratch",
        "issues-manager-cli",
        "issues",
      );
      await mkdir(issuesDir, { recursive: true });

      await writeFile(
        join(workspacePath, ".scratch", "features-status.json"),
        `${JSON.stringify(
          {
            features: [
              { id: 1, slug: "issues-manager-cli", status: "in-progress" },
            ],
          },
          null,
          2,
        )}\n`,
        "utf8",
      );

      await writeFile(
        join(issuesDir, "02-example.md"),
        [
          "Status: ready-for-agent",
          "Method: tdd",
          "Complexity: 3",
          "BlockedBy: none",
          "",
          "# Example",
          "",
        ].join("\n"),
        "utf8",
      );

      const result = await updateIssueStatus({
        cwd: workspacePath,
        feature: {
          id: 1,
          slug: "issues-manager-cli",
          status: "in-progress",
        },
        issueId: 2,
        status: "done",
        force: true,
      });

      expect(result.status).toBe("done");

      const updatedMarkdown = await readFile(
        join(issuesDir, "02-example.md"),
        "utf8",
      );
      expect(updatedMarkdown).toContain("Status: done");
    } finally {
      await rm(workspacePath, { recursive: true, force: true });
    }
  });

  it("rejects invalid status vocabulary even with force", async () => {
    const workspacePath = await mkdtemp(
      join(tmpdir(), "issues-manager-cli-domain-"),
    );

    try {
      const issuesDir = join(
        workspacePath,
        ".scratch",
        "issues-manager-cli",
        "issues",
      );
      await mkdir(issuesDir, { recursive: true });

      await writeFile(
        join(issuesDir, "02-example.md"),
        [
          "Status: ready-for-agent",
          "Method: tdd",
          "Complexity: 3",
          "BlockedBy: none",
          "",
          "# Example",
          "",
        ].join("\n"),
        "utf8",
      );

      await expect(
        updateIssueStatus({
          cwd: workspacePath,
          feature: {
            id: 1,
            slug: "issues-manager-cli",
            status: "in-progress",
          },
          issueId: 2,
          status: "invalid-status",
          force: true,
        }),
      ).rejects.toThrowError(/invalid status/i);
    } finally {
      await rm(workspacePath, { recursive: true, force: true });
    }
  });

  it("fails for an unknown issue id", async () => {
    const workspacePath = await mkdtemp(
      join(tmpdir(), "issues-manager-cli-domain-"),
    );

    try {
      const issuesDir = join(
        workspacePath,
        ".scratch",
        "issues-manager-cli",
        "issues",
      );
      await mkdir(issuesDir, { recursive: true });

      await writeFile(
        join(issuesDir, "02-example.md"),
        [
          "Status: ready-for-agent",
          "Method: tdd",
          "Complexity: 3",
          "BlockedBy: none",
          "",
          "# Example",
          "",
        ].join("\n"),
        "utf8",
      );

      await expect(
        updateIssueStatus({
          cwd: workspacePath,
          feature: {
            id: 1,
            slug: "issues-manager-cli",
            status: "in-progress",
          },
          issueId: 999,
          status: "in-progress",
        }),
      ).rejects.toThrowError(/unknown issue/i);
    } finally {
      await rm(workspacePath, { recursive: true, force: true });
    }
  });

  it("refreshes issue lastUpdated after status update", async () => {
    const workspacePath = await mkdtemp(
      join(tmpdir(), "issues-manager-cli-domain-"),
    );

    try {
      const issuesDir = join(
        workspacePath,
        ".scratch",
        "issues-manager-cli",
        "issues",
      );
      await mkdir(issuesDir, { recursive: true });

      await writeFile(
        join(workspacePath, ".scratch", "features-status.json"),
        `${JSON.stringify(
          {
            features: [
              { id: 1, slug: "issues-manager-cli", status: "in-progress" },
            ],
          },
          null,
          2,
        )}\n`,
        "utf8",
      );

      await writeFile(
        join(issuesDir, "02-example.md"),
        [
          "Status: ready-for-agent",
          "Method: tdd",
          "Complexity: 3",
          "BlockedBy: none",
          "",
          "# Example",
          "",
        ].join("\n"),
        "utf8",
      );

      const before = new Date();

      await updateIssueStatus({
        cwd: workspacePath,
        feature: {
          id: 1,
          slug: "issues-manager-cli",
          status: "in-progress",
        },
        issueId: 2,
        status: "in-progress",
      });

      const regenerated = JSON.parse(
        await readFile(
          join(
            workspacePath,
            ".scratch",
            "issues-manager-cli",
            "issues-status.json",
          ),
          "utf8",
        ),
      ) as { lastUpdated: string };

      const updated = new Date(regenerated.lastUpdated);
      expect(updated.getTime()).toBeGreaterThanOrEqual(before.getTime());
    } finally {
      await rm(workspacePath, { recursive: true, force: true });
    }
  });

  it("refreshes feature lastUpdated after status update", async () => {
    const workspacePath = await mkdtemp(
      join(tmpdir(), "issues-manager-cli-domain-"),
    );

    try {
      const issuesDir = join(
        workspacePath,
        ".scratch",
        "issues-manager-cli",
        "issues",
      );
      await mkdir(issuesDir, { recursive: true });

      const scratchDir = join(workspacePath, ".scratch");
      const featuresStatus = {
        features: [
          {
            id: 1,
            slug: "issues-manager-cli",
            status: "in-progress",
            lastUpdated: "2020-01-01T00:00:00.000Z",
          },
        ],
        lastUpdated: "2020-01-01T00:00:00.000Z",
      };
      await writeFile(
        join(scratchDir, "features-status.json"),
        `${JSON.stringify(featuresStatus, null, 2)}\n`,
        "utf8",
      );

      await writeFile(
        join(issuesDir, "02-example.md"),
        [
          "Status: ready-for-agent",
          "Method: tdd",
          "Complexity: 3",
          "BlockedBy: none",
          "",
          "# Example",
          "",
        ].join("\n"),
        "utf8",
      );

      const before = new Date();

      await updateIssueStatus({
        cwd: workspacePath,
        feature: {
          id: 1,
          slug: "issues-manager-cli",
          status: "in-progress",
        },
        issueId: 2,
        status: "in-progress",
      });

      const updatedFeatures = JSON.parse(
        await readFile(join(scratchDir, "features-status.json"), "utf8"),
      ) as {
        lastUpdated: string;
        features: Array<{ slug: string; lastUpdated: string }>;
      };

      if (!updatedFeatures)
        throw new Error("Missing features-status.json after update");

      if (!updatedFeatures.features)
        throw new Error(
          "Missing features in features-status.json after update",
        );

      const feature = updatedFeatures.features.find(
        (f) => f.slug === "issues-manager-cli",
      );
      if (!feature)
        throw new Error("Feature 'issues-manager-cli' not found in update");
      const featureUpdated = new Date(feature.lastUpdated);
      const rootUpdated = new Date(updatedFeatures.lastUpdated);

      expect(featureUpdated.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(rootUpdated.getTime()).toBeGreaterThanOrEqual(before.getTime());
    } finally {
      await rm(workspacePath, { recursive: true, force: true });
    }
  });

  it("unblocks downstream issues when a blocker reaches done", async () => {
    const workspacePath = await mkdtemp(
      join(tmpdir(), "issues-manager-cli-domain-"),
    );

    try {
      const issuesDir = join(
        workspacePath,
        ".scratch",
        "issues-manager-cli",
        "issues",
      );
      await mkdir(issuesDir, { recursive: true });

      await writeFile(
        join(workspacePath, ".scratch", "features-status.json"),
        `${JSON.stringify(
          {
            features: [
              { id: 1, slug: "issues-manager-cli", status: "in-progress" },
            ],
          },
          null,
          2,
        )}\n`,
        "utf8",
      );

      // Issue 1: blocked by issue 2
      await writeFile(
        join(issuesDir, "01-blocked.md"),
        [
          "Status: ready-for-agent",
          "Method: tdd",
          "Complexity: 2",
          "BlockedBy: 2",
          "",
          "# Blocked downstream issue",
          "",
        ].join("\n"),
        "utf8",
      );

      // Issue 2: the blocker, currently in-progress
      await writeFile(
        join(issuesDir, "02-blocker.md"),
        [
          "Status: in-progress",
          "Method: tdd",
          "Complexity: 1",
          "BlockedBy: none",
          "",
          "# Blocker issue",
          "",
        ].join("\n"),
        "utf8",
      );

      await updateIssueStatus({
        cwd: workspacePath,
        feature: {
          id: 1,
          slug: "issues-manager-cli",
          status: "in-progress",
        },
        issueId: 2,
        status: "done",
      });

      const regenerated: IssuesState = JSON.parse(
        await readFile(
          join(
            workspacePath,
            ".scratch",
            "issues-manager-cli",
            "issues-status.json",
          ),
          "utf8",
        ),
      );

      const downstream = regenerated.issues.find((i) => i.id === 1);
      if (!downstream) throw new Error("Downstream issue not found");
      expect(downstream).toBeDefined();
      // Issue 1 is still blockedBy [2], but blocker 2 is now done
      // so getActionableIssues should include it
      const actionable = getActionableIssues(regenerated);
      expect(actionable.some((i) => i.id === 1)).toBe(true);
    } finally {
      await rm(workspacePath, { recursive: true, force: true });
    }
  });
});
