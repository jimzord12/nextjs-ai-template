// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  FeatureStateError,
  resolveCurrentFeature,
  validateFeaturesState,
} from "./features-state";

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

describe("validateFeaturesState milestone", () => {
  it("accepts a valid milestone", () => {
    const state = validateFeaturesState({
      features: [{ id: 1, slug: "test", status: "todo", milestone: 5 }],
    });

    expect(state.features[0].milestone).toBe(5);
  });

  it("accepts missing milestone (undefined)", () => {
    const state = validateFeaturesState({
      features: [{ id: 1, slug: "test", status: "todo" }],
    });

    expect(state.features[0].milestone).toBeUndefined();
  });

  it("rejects non-integer milestone", () => {
    expect(() =>
      validateFeaturesState({
        features: [{ id: 1, slug: "test", status: "todo", milestone: 1.5 }],
      }),
    ).toThrowError(FeatureStateError);
  });

  it("rejects zero milestone", () => {
    expect(() =>
      validateFeaturesState({
        features: [{ id: 1, slug: "test", status: "todo", milestone: 0 }],
      }),
    ).toThrowError(FeatureStateError);
  });

  it("rejects negative milestone", () => {
    expect(() =>
      validateFeaturesState({
        features: [{ id: 1, slug: "test", status: "todo", milestone: -1 }],
      }),
    ).toThrowError(FeatureStateError);
  });

  it("rejects string milestone", () => {
    expect(() =>
      validateFeaturesState({
        features: [{ id: 1, slug: "test", status: "todo", milestone: "abc" }],
      }),
    ).toThrowError(FeatureStateError);
  });
});
