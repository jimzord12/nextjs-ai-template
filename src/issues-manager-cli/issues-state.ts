import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  FeatureStateError,
  type FeatureRecord,
  type FeaturesState,
  resolveCurrentFeature,
} from "./features-state";

export type IssueRecord = {
  id: number;
  title: string;
  status: string;
  method: string;
  complexity: number;
  filePath: string;
};

export type IssuesState = {
  featureId: number;
  featureSlug: string;
  featureStatus?: string;
  issues: IssueRecord[];
  lastUpdated?: string;
};

export class IssueStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IssueStateError";
  }
}

export function getIssuesStatusPath(cwd: string, featureSlug: string) {
  return join(cwd, ".scratch", featureSlug, "issues-status.json");
}

export function resolveFeatureForIssueRead(
  state: FeaturesState,
  explicitFeatureSlug?: string,
): FeatureRecord {
  if (explicitFeatureSlug) {
    const feature = state.features.find((entry) => entry.slug === explicitFeatureSlug);

    if (!feature) {
      throw new FeatureStateError(
        `Unknown feature "${explicitFeatureSlug}". Choose an existing feature slug from .scratch/features-status.json.`,
      );
    }

    return feature;
  }

  return resolveCurrentFeature(state);
}

export async function readIssuesState(
  cwd: string,
  featureSlug: string,
): Promise<IssuesState> {
  const filePath = getIssuesStatusPath(cwd, featureSlug);
  let raw: string;

  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    throw new IssueStateError(
      `Missing derived issue state at ${filePath}. Regenerate .scratch/${featureSlug}/issues-status.json before listing issues.`,
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new IssueStateError(
      `Malformed derived issue state at ${filePath}. Expected valid JSON in .scratch/${featureSlug}/issues-status.json.`,
    );
  }

  return validateIssuesState(parsed, filePath);
}

export function validateIssuesState(
  value: unknown,
  sourceLabel = "issues-status.json",
): IssuesState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new IssueStateError(
      `Invalid derived issue state in ${sourceLabel}. Expected a JSON object with feature metadata and an issues array.`,
    );
  }

  const candidate = value as Record<string, unknown>;

  if (!Number.isInteger(candidate.featureId) || Number(candidate.featureId) <= 0) {
    throw new IssueStateError(
      `Invalid derived issue state in ${sourceLabel}. Expected a positive integer featureId.`,
    );
  }

  if (
    typeof candidate.featureSlug !== "string" ||
    candidate.featureSlug.trim().length === 0
  ) {
    throw new IssueStateError(
      `Invalid derived issue state in ${sourceLabel}. Expected a non-empty featureSlug.`,
    );
  }

  if (!Array.isArray(candidate.issues)) {
    throw new IssueStateError(
      `Invalid derived issue state in ${sourceLabel}. Expected \"issues\" to be an array.`,
    );
  }

  return {
    featureId: Number(candidate.featureId),
    featureSlug: candidate.featureSlug.trim(),
    featureStatus:
      typeof candidate.featureStatus === "string"
        ? candidate.featureStatus
        : undefined,
    lastUpdated:
      typeof candidate.lastUpdated === "string" ? candidate.lastUpdated : undefined,
    issues: candidate.issues.map((issue, index) =>
      validateIssueRecord(issue, index, sourceLabel),
    ),
  };
}

function validateIssueRecord(
  value: unknown,
  index: number,
  sourceLabel: string,
): IssueRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new IssueStateError(
      `Invalid issue at index ${index} in ${sourceLabel}. Expected an object with id, title, status, method, complexity, and filePath.`,
    );
  }

  const candidate = value as Record<string, unknown>;

  if (!Number.isInteger(candidate.id) || Number(candidate.id) <= 0) {
    throw new IssueStateError(
      `Invalid issue at index ${index} in ${sourceLabel}. Expected a positive integer id.`,
    );
  }

  if (typeof candidate.title !== "string" || candidate.title.trim().length === 0) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Expected a non-empty title.`,
    );
  }

  if (typeof candidate.status !== "string" || candidate.status.trim().length === 0) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Expected a non-empty status.`,
    );
  }

  if (typeof candidate.method !== "string" || candidate.method.trim().length === 0) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Expected a non-empty method.`,
    );
  }

  if (!Number.isInteger(candidate.complexity) || Number(candidate.complexity) <= 0) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Expected a positive integer complexity.`,
    );
  }

  if (
    typeof candidate.filePath !== "string" ||
    candidate.filePath.trim().length === 0
  ) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Expected a non-empty filePath.`,
    );
  }

  return {
    id: Number(candidate.id),
    title: candidate.title.trim(),
    status: candidate.status.trim(),
    method: candidate.method.trim(),
    complexity: Number(candidate.complexity),
    filePath: candidate.filePath.trim(),
  };
}