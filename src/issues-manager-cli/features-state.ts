import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const FEATURE_STATUSES = ["todo", "in-progress", "archived"] as const;

export type FeatureStatus = (typeof FEATURE_STATUSES)[number];

export type FeatureRecord = {
  id: number;
  slug: string;
  status: FeatureStatus;
  lastUpdated?: string;
  finalStatus?: "done" | "cancelled" | null;
};

export type FeaturesState = {
  features: FeatureRecord[];
  lastUpdated?: string;
  nextFeatureId?: number;
  version?: string;
};

export class FeatureStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FeatureStateError";
  }
}

export function getFeaturesStatusPath(cwd: string) {
  return join(cwd, ".scratch", "features-status.json");
}

export async function readFeaturesState(cwd: string): Promise<FeaturesState> {
  const filePath = getFeaturesStatusPath(cwd);
  let raw: string;

  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    throw new FeatureStateError(
      `Missing feature state at ${filePath}. Create .scratch/features-status.json before using the CLI.`,
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new FeatureStateError(
      `Malformed feature state at ${filePath}. Expected valid JSON in .scratch/features-status.json.`,
    );
  }

  return validateFeaturesState(parsed, filePath);
}

export function validateFeaturesState(
  value: unknown,
  sourceLabel = ".scratch/features-status.json",
): FeaturesState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new FeatureStateError(
      `Invalid feature state in ${sourceLabel}. Expected a JSON object with a features array.`,
    );
  }

  const candidate = value as Record<string, unknown>;

  if (!Array.isArray(candidate.features)) {
    throw new FeatureStateError(
      `Invalid feature state in ${sourceLabel}. Expected "features" to be an array.`,
    );
  }

  const features = candidate.features.map((feature, index) =>
    validateFeatureRecord(feature, index, sourceLabel),
  );

  return {
    features,
    lastUpdated:
      typeof candidate.lastUpdated === "string"
        ? candidate.lastUpdated
        : undefined,
    nextFeatureId:
      typeof candidate.nextFeatureId === "number"
        ? candidate.nextFeatureId
        : undefined,
    version:
      typeof candidate.version === "string" ? candidate.version : undefined,
  };
}

function validateFeatureRecord(
  value: unknown,
  index: number,
  sourceLabel: string,
): FeatureRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new FeatureStateError(
      `Invalid feature at index ${index} in ${sourceLabel}. Expected an object with id, slug, and status.`,
    );
  }

  const candidate = value as Record<string, unknown>;

  if (!Number.isInteger(candidate.id) || Number(candidate.id) <= 0) {
    throw new FeatureStateError(
      `Invalid feature at index ${index} in ${sourceLabel}. Expected a positive integer id.`,
    );
  }

  if (
    typeof candidate.slug !== "string" ||
    candidate.slug.trim().length === 0
  ) {
    throw new FeatureStateError(
      `Invalid feature at index ${index} in ${sourceLabel}. Expected a non-empty slug.`,
    );
  }

  if (
    typeof candidate.status !== "string" ||
    !FEATURE_STATUSES.includes(candidate.status as FeatureStatus)
  ) {
    throw new FeatureStateError(
      `Invalid feature ${candidate.slug} in ${sourceLabel}. Status must be one of: ${FEATURE_STATUSES.join(", ")}.`,
    );
  }

  if (
    candidate.finalStatus !== undefined &&
    candidate.finalStatus !== null &&
    candidate.finalStatus !== "done" &&
    candidate.finalStatus !== "cancelled"
  ) {
    throw new FeatureStateError(
      `Invalid feature ${candidate.slug} in ${sourceLabel}. finalStatus must be null, done, or cancelled.`,
    );
  }

  return {
    id: Number(candidate.id),
    slug: candidate.slug.trim(),
    status: candidate.status as FeatureStatus,
    lastUpdated:
      typeof candidate.lastUpdated === "string"
        ? candidate.lastUpdated
        : undefined,
    finalStatus:
      candidate.finalStatus === undefined
        ? undefined
        : (candidate.finalStatus as FeatureRecord["finalStatus"]),
  };
}

export function resolveCurrentFeature(state: FeaturesState): FeatureRecord {
  const activeFeatures = state.features.filter(
    (feature) => feature.status === "in-progress",
  );

  if (activeFeatures.length === 1) {
    return activeFeatures[0];
  }

  if (activeFeatures.length === 0) {
    throw new FeatureStateError(
      "No current feature. Activate a feature with update-feature <slug> --status in-progress before running commands that depend on the current feature.",
    );
  }

  const slugs = activeFeatures.map((feature) => feature.slug).join(", ");

  throw new FeatureStateError(
    `Ambiguous current feature. Multiple features are in-progress: ${slugs}. Move all but one feature out of in-progress with update-feature before running commands that depend on the current feature.`,
  );
}

export async function updateFeatureStatus(options: {
  cwd: string;
  slug: string;
  status: FeatureStatus;
}) {
  const state = await readFeaturesState(options.cwd);
  const feature = state.features.find((entry) => entry.slug === options.slug);

  if (!feature) {
    throw new FeatureStateError(
      `Unknown feature "${options.slug}". Choose an existing feature slug from .scratch/features-status.json.`,
    );
  }

  if (options.status === "in-progress") {
    const otherActiveFeature = state.features.find(
      (entry) => entry.slug !== options.slug && entry.status === "in-progress",
    );

    if (otherActiveFeature) {
      throw new FeatureStateError(
        `Cannot activate "${options.slug}" while "${otherActiveFeature.slug}" is already in-progress. First move the active feature out of in-progress, then retry update-feature.`,
      );
    }
  }

  const timestamp = new Date().toISOString();
  const nextState: FeaturesState = {
    ...state,
    lastUpdated: timestamp,
    features: state.features.map((entry) =>
      entry.slug === options.slug
        ? {
            ...entry,
            status: options.status,
            lastUpdated: timestamp,
          }
        : entry,
    ),
  };

  await writeFile(
    getFeaturesStatusPath(options.cwd),
    `${JSON.stringify(nextState, null, 2)}\n`,
    "utf8",
  );

  return nextState.features.find((entry) => entry.slug === options.slug)!;
}
