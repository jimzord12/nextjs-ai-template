// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  resolveCurrentFeature,
  validateFeaturesState,
} from "@/issues-manager-cli/features-state";

describe("resolveCurrentFeature", () => {
  it("returns the single in-progress feature", () => {
    const state = validateFeaturesState({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "in-progress" },
        { id: 2, slug: "production-template-baseline", status: "todo" },
      ],
    });

    expect(resolveCurrentFeature(state)).toEqual({
      id: 1,
      slug: "issues-manager-cli",
      status: "in-progress",
      lastUpdated: undefined,
      finalStatus: undefined,
    });
  });

  it("fails when no feature is in progress", () => {
    const state = validateFeaturesState({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "todo" },
        { id: 2, slug: "production-template-baseline", status: "archived" },
      ],
    });

    expect(() => resolveCurrentFeature(state)).toThrowError(
      /No current feature\. Activate a feature with update-feature <slug> --status in-progress before running commands that depend on the current feature\./,
    );
  });

  it("fails when more than one feature is in progress", () => {
    const state = validateFeaturesState({
      features: [
        { id: 1, slug: "issues-manager-cli", status: "in-progress" },
        { id: 2, slug: "production-template-baseline", status: "in-progress" },
      ],
    });

    expect(() => resolveCurrentFeature(state)).toThrowError(
      /Ambiguous current feature\. Multiple features are in-progress: issues-manager-cli, production-template-baseline\. Move all but one feature out of in-progress with update-feature before running commands that depend on the current feature\./,
    );
  });
});
