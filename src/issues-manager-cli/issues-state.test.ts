// @vitest-environment node

import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateFeaturesState } from "@/issues-manager-cli/features-state";
import {
  getActionableIssues,
  regenerateIssuesStateFromIssueFiles,
  resolveFeatureForIssueRead,
  updateIssueBlockers,
  validateIssuesState,
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
