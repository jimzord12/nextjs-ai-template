// @vitest-environment node

import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { FeatureRecord } from "./features-state";
import {
  computeMilestoneSummary,
  formatStatusOutput,
  type IssueBreakdownEntry,
  scanFeatureArtifacts,
} from "./status-scanner";

const workspaces: string[] = [];

afterEach(async () => {
  await Promise.all(
    workspaces
      .splice(0)
      .map((path) => rm(path, { recursive: true, force: true })),
  );
});

async function createTempDir() {
  const dir = await mkdtemp(join(tmpdir(), "status-scanner-test-"));
  workspaces.push(dir);
  return dir;
}

function makeFeature(overrides: Partial<FeatureRecord> = {}): FeatureRecord {
  return {
    id: 1,
    slug: "test-feature",
    status: "todo",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Step 1: scanFeatureArtifacts
// ---------------------------------------------------------------------------

describe("scanFeatureArtifacts", () => {
  it("returns all false for feature with no artifacts", async () => {
    const cwd = await createTempDir();
    const feature = makeFeature();
    // Feature directory doesn't exist at all

    const result = await scanFeatureArtifacts(cwd, feature);

    expect(result).toEqual({
      hasGrillSession: false,
      hasBrief: false,
      hasPrd: false,
      hasIssues: false,
      issueCounts: null,
      aiReviewPassed: false,
      humanReviewPassed: false,
    });
  });

  it("returns all true for feature with full pipeline artifacts", async () => {
    const cwd = await createTempDir();
    const feature = makeFeature({ id: 1, slug: "test-feature" });
    const featureDir = join(cwd, ".scratch", "features", "001-test-feature");

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
          { id: 3, status: "ready-for-agent" },
        ],
      }),
      "utf8",
    );

    const result = await scanFeatureArtifacts(cwd, feature);

    expect(result.hasGrillSession).toBe(true);
    expect(result.hasBrief).toBe(true);
    expect(result.hasPrd).toBe(true);
    expect(result.hasIssues).toBe(true);
    expect(result.issueCounts).toEqual({ done: 2, total: 3 });
    expect(result.aiReviewPassed).toBe(true);
    expect(result.humanReviewPassed).toBe(false); // not archived + done
  });

  it("returns humanReviewPassed true for archived + done feature", async () => {
    const cwd = await createTempDir();
    const feature = makeFeature({
      status: "archived",
      finalStatus: "done",
    });
    const featureDir = join(cwd, ".scratch", "features", "001-test-feature");
    await mkdir(featureDir, { recursive: true });

    const result = await scanFeatureArtifacts(cwd, feature);

    expect(result.humanReviewPassed).toBe(true);
  });

  it("returns humanReviewPassed false for archived + cancelled feature", async () => {
    const cwd = await createTempDir();
    const feature = makeFeature({
      status: "archived",
      finalStatus: "cancelled",
    });
    const featureDir = join(cwd, ".scratch", "features", "001-test-feature");
    await mkdir(featureDir, { recursive: true });

    const result = await scanFeatureArtifacts(cwd, feature);

    expect(result.humanReviewPassed).toBe(false);
  });

  it("returns issueCounts null when issues-status.json is missing", async () => {
    const cwd = await createTempDir();
    const feature = makeFeature();
    const featureDir = join(cwd, ".scratch", "features", "001-test-feature");

    await mkdir(join(featureDir, "issues"), { recursive: true });
    await writeFile(join(featureDir, "issues", "01-issue.md"), "", "utf8");
    // No issues-status.json

    const result = await scanFeatureArtifacts(cwd, feature);

    expect(result.hasIssues).toBe(true);
    expect(result.issueCounts).toBeNull();
  });

  it("returns aiReviewPassed false when reviews dir is empty", async () => {
    const cwd = await createTempDir();
    const feature = makeFeature();
    const featureDir = join(cwd, ".scratch", "features", "001-test-feature");

    await mkdir(join(featureDir, "reviews"), { recursive: true });
    // Empty reviews dir — no .md files

    const result = await scanFeatureArtifacts(cwd, feature);

    expect(result.aiReviewPassed).toBe(false);
  });

  it("returns issueCounts with correct done count including wontfix", async () => {
    const cwd = await createTempDir();
    const feature = makeFeature();
    const featureDir = join(cwd, ".scratch", "features", "001-test-feature");

    await mkdir(join(featureDir, "issues"), { recursive: true });
    await writeFile(join(featureDir, "issues", "01-issue.md"), "", "utf8");
    await writeFile(
      join(featureDir, "issues-status.json"),
      JSON.stringify({
        issues: [
          { id: 1, status: "done" },
          { id: 2, status: "wontfix" },
          { id: 3, status: "ready-for-agent" },
        ],
      }),
      "utf8",
    );

    const result = await scanFeatureArtifacts(cwd, feature);

    expect(result.issueCounts).toEqual({ done: 2, total: 3 });
  });
});

// ---------------------------------------------------------------------------
// Step 2: computeMilestoneSummary
// ---------------------------------------------------------------------------

describe("computeMilestoneSummary", () => {
  it("returns empty groups and all features unassigned when no milestones", () => {
    const features = [
      makeFeature({ id: 1, slug: "a" }),
      makeFeature({ id: 2, slug: "b" }),
    ];

    const result = computeMilestoneSummary(features);

    expect(result.groups).toEqual([]);
    expect(result.unassigned).toHaveLength(2);
    expect(result.hasMultipleActive).toBe(false);
  });

  it("groups features by milestone", () => {
    const features = [
      makeFeature({ id: 1, slug: "a", milestone: 1, status: "todo" }),
      makeFeature({ id: 2, slug: "b", milestone: 1, status: "todo" }),
      makeFeature({ id: 3, slug: "c", milestone: 2, status: "todo" }),
    ];

    const result = computeMilestoneSummary(features);

    expect(result.groups).toHaveLength(2);
    expect(result.groups[0]).toEqual({
      milestone: 1,
      total: 2,
      done: 0,
      inProgress: 0,
      status: "not-started",
    });
    expect(result.groups[1]).toEqual({
      milestone: 2,
      total: 1,
      done: 0,
      inProgress: 0,
      status: "not-started",
    });
  });

  it("derives in-progress status when some features are active", () => {
    const features = [
      makeFeature({ id: 1, slug: "a", milestone: 1, status: "in-progress" }),
      makeFeature({ id: 2, slug: "b", milestone: 1, status: "todo" }),
    ];

    const result = computeMilestoneSummary(features);

    expect(result.groups[0].status).toBe("in-progress");
    expect(result.groups[0].inProgress).toBe(1);
  });

  it("derives done status when all features are archived + done", () => {
    const features = [
      makeFeature({
        id: 1,
        slug: "a",
        milestone: 1,
        status: "archived",
        finalStatus: "done",
      }),
      makeFeature({
        id: 2,
        slug: "b",
        milestone: 1,
        status: "archived",
        finalStatus: "done",
      }),
    ];

    const result = computeMilestoneSummary(features);

    expect(result.groups[0].status).toBe("done");
    expect(result.groups[0].done).toBe(2);
  });

  it("detects multiple active milestones", () => {
    const features = [
      makeFeature({ id: 1, slug: "a", milestone: 1, status: "in-progress" }),
      makeFeature({ id: 2, slug: "b", milestone: 2, status: "in-progress" }),
    ];

    const result = computeMilestoneSummary(features);

    expect(result.hasMultipleActive).toBe(true);
  });

  it("does not flag multiple active when only one milestone is active", () => {
    const features = [
      makeFeature({ id: 1, slug: "a", milestone: 1, status: "in-progress" }),
      makeFeature({ id: 2, slug: "b", milestone: 2, status: "todo" }),
    ];

    const result = computeMilestoneSummary(features);

    expect(result.hasMultipleActive).toBe(false);
  });

  it("sorts milestone groups by milestone number", () => {
    const features = [
      makeFeature({ id: 1, slug: "a", milestone: 3, status: "todo" }),
      makeFeature({ id: 2, slug: "b", milestone: 1, status: "todo" }),
      makeFeature({ id: 3, slug: "c", milestone: 2, status: "todo" }),
    ];

    const result = computeMilestoneSummary(features);

    expect(result.groups.map((g) => g.milestone)).toEqual([1, 2, 3]);
  });

  it("splits features between milestones and unassigned", () => {
    const features = [
      makeFeature({ id: 1, slug: "a", milestone: 1 }),
      makeFeature({ id: 2, slug: "b" }), // no milestone
    ];

    const result = computeMilestoneSummary(features);

    expect(result.groups).toHaveLength(1);
    expect(result.unassigned).toHaveLength(1);
    expect(result.unassigned[0].slug).toBe("b");
  });
});

// ---------------------------------------------------------------------------
// Step 3: formatStatusOutput
// ---------------------------------------------------------------------------

describe("formatStatusOutput", () => {
  it("returns 'No features registered.' when empty", () => {
    const result = formatStatusOutput(
      { groups: [], unassigned: [], hasMultipleActive: false },
      new Map(),
      [],
      new Map(),
    );

    expect(result.stdout).toBe("No features registered.");
    expect(result.stderr).toBe("");
  });

  it("formats milestone summary table", () => {
    const summary = computeMilestoneSummary([
      makeFeature({ id: 1, slug: "a", milestone: 1, status: "in-progress" }),
      makeFeature({ id: 2, slug: "b", milestone: 1, status: "todo" }),
      makeFeature({
        id: 3,
        slug: "c",
        milestone: 1,
        status: "archived",
        finalStatus: "done",
      }),
    ]);

    const result = formatStatusOutput(
      summary,
      new Map(),
      [
        makeFeature({ id: 1, slug: "a", milestone: 1, status: "in-progress" }),
        makeFeature({ id: 2, slug: "b", milestone: 1, status: "todo" }),
        makeFeature({
          id: 3,
          slug: "c",
          milestone: 1,
          status: "archived",
          finalStatus: "done",
        }),
      ],
      new Map(),
    );

    expect(result.stdout).toContain("=== Milestones ===");
    expect(result.stdout).toContain(
      "M1  | 1/3 done  | 1 in-progress  | in-progress",
    );
  });

  it("formats per-feature pipeline state", () => {
    const feature = makeFeature({ id: 1, slug: "test-feature", milestone: 2 });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, {
      hasGrillSession: true,
      hasBrief: false,
      hasPrd: true,
      hasIssues: true,
      issueCounts: { done: 2, total: 5 },
      aiReviewPassed: false,
      humanReviewPassed: false,
    });

    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      new Map(),
    );

    expect(result.stdout).toContain("> Feature: 001-test-feature (todo)");
    expect(result.stdout).toContain("- milestone: M2");
    expect(result.stdout).toContain("- Has Grill Session: true");
    expect(result.stdout).toContain("- Has Brief: false");
    expect(result.stdout).toContain("- Has PRD: true");
    expect(result.stdout).toContain("- Has issues: true");
    expect(result.stdout).toContain("- completed issues: 2/5");
    expect(result.stdout).toContain("- AI Review Passed: false");
    expect(result.stdout).toContain("- Human Review Passed: false");
  });

  it("emits unassigned warning in stderr", () => {
    const feature = makeFeature({ id: 1, slug: "no-mile" });
    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      new Map(),
      [feature],
      new Map(),
    );

    expect(result.stderr).toContain(
      "⚠ 1 feature(s) have no milestone assigned",
    );
  });

  it("emits multiple active milestones warning in stderr", () => {
    const feature = makeFeature({ id: 1, slug: "a", milestone: 1 });
    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: true },
      new Map(),
      [feature],
      new Map(),
    );

    expect(result.stderr).toContain(
      "⚠ Multiple milestones have in-progress features",
    );
  });

  it("shows completed issues as dash when issueCounts is null", () => {
    const feature = makeFeature({ id: 1, slug: "test" });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, {
      hasGrillSession: false,
      hasBrief: false,
      hasPrd: false,
      hasIssues: false,
      issueCounts: null,
      aiReviewPassed: false,
      humanReviewPassed: false,
    });

    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      new Map(),
    );

    expect(result.stdout).toContain("- completed issues: —");
  });

  it("omits milestone line when feature has no milestone", () => {
    const feature = makeFeature({ id: 1, slug: "no-mile" });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, {
      hasGrillSession: false,
      hasBrief: false,
      hasPrd: false,
      hasIssues: false,
      issueCounts: null,
      aiReviewPassed: false,
      humanReviewPassed: false,
    });

    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      new Map(),
    );

    expect(result.stdout).not.toContain("- milestone:");
  });
});

// ---------------------------------------------------------------------------
// Step 4: Issue breakdown in formatStatusOutput
// ---------------------------------------------------------------------------

describe("formatStatusOutput — issue breakdown", () => {
  function makeArtifacts(
    overrides: Partial<import("./status-scanner").FeatureArtifacts> = {},
  ): import("./status-scanner").FeatureArtifacts {
    return {
      hasGrillSession: false,
      hasBrief: false,
      hasPrd: false,
      hasIssues: true,
      issueCounts: { done: 0, total: 0 },
      aiReviewPassed: false,
      humanReviewPassed: false,
      ...overrides,
    };
  }

  function makeBreakdown(
    entries: IssueBreakdownEntry[],
  ): Map<number, IssueBreakdownEntry[]> {
    const map = new Map<number, IssueBreakdownEntry[]>();
    map.set(1, entries);
    return map;
  }

  it("shows issue breakdown for in-progress feature with issues", () => {
    const feature = makeFeature({
      id: 1,
      slug: "active-feature",
      status: "in-progress",
      milestone: 1,
    });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, makeArtifacts());

    const issues: IssueBreakdownEntry[] = [
      { id: 1, title: "Fix config aliases", status: "done" },
      { id: 2, title: "Version pinning audit", status: "done" },
      { id: 3, title: "I18n routing skeleton", status: "done" },
      { id: 4, title: "Local CMS foundation", status: "ready-for-agent" },
    ];

    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      makeBreakdown(issues),
    );

    expect(result.stdout).toContain("  - Issues:");
    expect(result.stdout).toContain("    - #01 Fix config aliases  [done]");
    expect(result.stdout).toContain("    - #02 Version pinning audit  [done]");
    expect(result.stdout).toContain("    - #03 I18n routing skeleton  [done]");
    expect(result.stdout).toContain(
      "    - #04 Local CMS foundation  [ready-for-agent]",
    );
  });

  it("shows Issues: none for in-progress feature with no issues", () => {
    const feature = makeFeature({
      id: 1,
      slug: "empty-active",
      status: "in-progress",
      milestone: 1,
    });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, makeArtifacts());

    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      makeBreakdown([]),
    );

    expect(result.stdout).toContain("  - Issues: none");
    expect(result.stdout).not.toMatch(/ {4}- #\d+/);
  });

  it("shows Issues: none for in-progress feature with no breakdown map entry", () => {
    const feature = makeFeature({
      id: 1,
      slug: "no-map-entry",
      status: "in-progress",
      milestone: 1,
    });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, makeArtifacts());

    // Empty map — no entry for feature id 1
    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      new Map(),
    );

    expect(result.stdout).toContain("  - Issues: none");
  });

  it("does not show issue breakdown for todo feature", () => {
    const feature = makeFeature({
      id: 1,
      slug: "todo-feature",
      status: "todo",
      milestone: 1,
    });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, makeArtifacts());

    const issues: IssueBreakdownEntry[] = [
      { id: 1, title: "Some issue", status: "ready-for-agent" },
    ];

    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      makeBreakdown(issues),
    );

    expect(result.stdout).not.toContain("  - Issues:");
    expect(result.stdout).not.toContain("    - #01");
  });

  it("does not show issue breakdown for archived feature", () => {
    const feature = makeFeature({
      id: 1,
      slug: "archived-feature",
      status: "archived",
      finalStatus: "done",
      milestone: 1,
    });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, makeArtifacts());

    const issues: IssueBreakdownEntry[] = [
      { id: 1, title: "Done issue", status: "done" },
    ];

    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      makeBreakdown(issues),
    );

    expect(result.stdout).not.toContain("  - Issues:");
    expect(result.stdout).not.toContain("    - #01");
  });

  it("lists issues in ascending ID order", () => {
    const feature = makeFeature({
      id: 1,
      slug: "order-test",
      status: "in-progress",
      milestone: 1,
    });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, makeArtifacts());

    // Pass issues in reverse order
    const issues: IssueBreakdownEntry[] = [
      { id: 5, title: "Fifth issue", status: "todo" },
      { id: 2, title: "Second issue", status: "done" },
      { id: 10, title: "Tenth issue", status: "ready-for-agent" },
    ];

    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      makeBreakdown(issues),
    );

    const lines = result.stdout.split("\n");
    const issueLines = lines.filter((l) => l.includes("    - #"));
    expect(issueLines[0]).toContain("#02");
    expect(issueLines[1]).toContain("#05");
    expect(issueLines[2]).toContain("#10");
  });

  it("formats issue lines as #<id> <title>  [<status>]", () => {
    const feature = makeFeature({
      id: 1,
      slug: "format-test",
      status: "in-progress",
      milestone: 1,
    });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, makeArtifacts());

    const issues: IssueBreakdownEntry[] = [
      { id: 1, title: "Fix config", status: "done" },
    ];

    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      makeBreakdown(issues),
    );

    expect(result.stdout).toContain("    - #01 Fix config  [done]");
  });

  it("pads issue IDs to 2 digits", () => {
    const feature = makeFeature({
      id: 1,
      slug: "pad-test",
      status: "in-progress",
      milestone: 1,
    });
    const artifacts = new Map<
      number,
      import("./status-scanner").FeatureArtifacts
    >();
    artifacts.set(1, makeArtifacts());

    const issues: IssueBreakdownEntry[] = [
      { id: 1, title: "First", status: "done" },
      { id: 10, title: "Tenth", status: "ready-for-agent" },
    ];

    const result = formatStatusOutput(
      { groups: [], unassigned: [feature], hasMultipleActive: false },
      artifacts,
      [feature],
      makeBreakdown(issues),
    );

    expect(result.stdout).toContain("    - #01 First  [done]");
    expect(result.stdout).toContain("    - #10 Tenth  [ready-for-agent]");
  });
});
