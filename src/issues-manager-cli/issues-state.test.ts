// @vitest-environment node

import { describe, expect, it } from "vitest";
import { validateFeaturesState } from "@/issues-manager-cli/features-state";
import {
  resolveFeatureForIssueRead,
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

    expect(resolveFeatureForIssueRead(state, "production-template-baseline")).toEqual({
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
          },
        ],
      }),
    ).toThrowError(/Expected a non-empty filePath\./);
  });
});