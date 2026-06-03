import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  type FeatureRecord,
  FeatureStateError,
  type FeaturesState,
  resolveCurrentFeature,
} from "./features-state";

export type IssueRecord = {
  id: number;
  title: string;
  status: string;
  method: string;
  complexity: number;
  blockedBy: number[];
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

function getIssueFilesDir(cwd: string, featureSlug: string) {
  return join(cwd, ".scratch", featureSlug, "issues");
}

export function resolveFeatureForIssueRead(
  state: FeaturesState,
  explicitFeatureSlug?: string,
): FeatureRecord {
  if (explicitFeatureSlug) {
    const feature = state.features.find(
      (entry) => entry.slug === explicitFeatureSlug,
    );

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

  if (
    !Number.isInteger(candidate.featureId) ||
    Number(candidate.featureId) <= 0
  ) {
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
      `Invalid derived issue state in ${sourceLabel}. Expected "issues" to be an array.`,
    );
  }

  const issues = candidate.issues.map((issue, index) =>
    validateIssueRecord(issue, index, sourceLabel),
  );

  validateIssueBlockerGraph(issues, sourceLabel);

  return {
    featureId: Number(candidate.featureId),
    featureSlug: candidate.featureSlug.trim(),
    featureStatus:
      typeof candidate.featureStatus === "string"
        ? candidate.featureStatus
        : undefined,
    lastUpdated:
      typeof candidate.lastUpdated === "string"
        ? candidate.lastUpdated
        : undefined,
    issues,
  };
}

export function getActionableIssues(state: IssuesState): IssueRecord[] {
  const issuesById = new Map(state.issues.map((issue) => [issue.id, issue]));

  return state.issues.filter(
    (issue) =>
      issue.status === "ready-for-agent" && !isIssueBlocked(issue, issuesById),
  );
}

export async function regenerateIssuesStateFromIssueFiles(options: {
  cwd: string;
  feature: FeatureRecord;
}): Promise<IssuesState> {
  const issuesDir = getIssueFilesDir(options.cwd, options.feature.slug);
  let entries: string[];

  try {
    entries = await readdir(issuesDir);
  } catch {
    throw new IssueStateError(
      `Missing issues directory at ${issuesDir}. Create .scratch/${options.feature.slug}/issues before regenerating issue state.`,
    );
  }

  const issueFiles = entries
    .filter(
      (entry) => /^(\d+).+\.md$/i.test(entry) || /^(\d+)\.md$/i.test(entry),
    )
    .sort();

  const issues = await Promise.all(
    issueFiles.map(async (entry) => {
      const filePath = join(issuesDir, entry);
      const content = await readFile(filePath, "utf8");

      return parseIssueMarkdown({
        content,
        sourceLabel: filePath,
        featureSlug: options.feature.slug,
        fileName: entry,
      });
    }),
  );

  issues.sort((a, b) => a.id - b.id);

  const state: IssuesState = {
    featureId: options.feature.id,
    featureSlug: options.feature.slug,
    featureStatus: options.feature.status,
    lastUpdated: new Date().toISOString(),
    issues,
  };

  const validated = validateIssuesState(
    state,
    `.scratch/${options.feature.slug}/issues-status.json`,
  );

  await writeFile(
    getIssuesStatusPath(options.cwd, options.feature.slug),
    `${JSON.stringify(validated, null, 2)}\n`,
    "utf8",
  );

  return validated;
}

export async function updateIssueBlockers(options: {
  cwd: string;
  feature: FeatureRecord;
  issueId: number;
  blockedBy: number[];
}) {
  const issuesDir = getIssueFilesDir(options.cwd, options.feature.slug);
  let entries: string[];

  try {
    entries = await readdir(issuesDir);
  } catch {
    throw new IssueStateError(
      `Missing issues directory at ${issuesDir}. Create .scratch/${options.feature.slug}/issues before updating blockers.`,
    );
  }

  const targetEntry = entries.find(
    (entry) => parseIssueIdFromFileName(entry) === options.issueId,
  );

  if (!targetEntry) {
    throw new IssueStateError(
      `Unknown issue ${options.issueId} in feature "${options.feature.slug}". Choose an existing issue file in .scratch/${options.feature.slug}/issues.`,
    );
  }

  const targetPath = join(issuesDir, targetEntry);
  const current = await readFile(targetPath, "utf8");
  const canonicalLine = `BlockedBy: ${formatBlockedBy(options.blockedBy)}`;
  const next = upsertBlockedByHeader(current, canonicalLine);

  await writeFile(targetPath, next, "utf8");

  const state = await regenerateIssuesStateFromIssueFiles({
    cwd: options.cwd,
    feature: options.feature,
  });

  return {
    issueId: options.issueId,
    featureSlug: options.feature.slug,
    blockedBy: [...options.blockedBy],
    issuesState: state,
    issuePath: `.scratch/${options.feature.slug}/issues/${targetEntry}`,
  };
}

function isIssueBlocked(
  issue: IssueRecord,
  issuesById: Map<number, IssueRecord>,
): boolean {
  return issue.blockedBy.some((blockerId) => {
    const blocker = issuesById.get(blockerId);

    if (!blocker) {
      return true;
    }

    return blocker.status !== "done";
  });
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

  if (
    typeof candidate.title !== "string" ||
    candidate.title.trim().length === 0
  ) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Expected a non-empty title.`,
    );
  }

  if (
    typeof candidate.status !== "string" ||
    candidate.status.trim().length === 0
  ) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Expected a non-empty status.`,
    );
  }

  if (
    typeof candidate.method !== "string" ||
    candidate.method.trim().length === 0
  ) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Expected a non-empty method.`,
    );
  }

  if (
    !Number.isInteger(candidate.complexity) ||
    Number(candidate.complexity) <= 0
  ) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Expected a positive integer complexity.`,
    );
  }

  if (!("blockedBy" in candidate)) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Missing canonical BlockedBy field; blocker-aware commands do not support legacy prose-only blockers.`,
    );
  }

  if (!Array.isArray(candidate.blockedBy)) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Expected blockedBy to be an array of issue IDs, or an empty array for BlockedBy: none.`,
    );
  }

  const blockedBy = candidate.blockedBy.map((blockerId) => {
    if (!Number.isInteger(blockerId) || Number(blockerId) <= 0) {
      throw new IssueStateError(
        `Invalid issue ${candidate.id} in ${sourceLabel}. Blocker IDs must be positive integers.`,
      );
    }

    return Number(blockerId);
  });

  if (blockedBy.includes(Number(candidate.id))) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. An issue cannot block itself.`,
    );
  }

  if (new Set(blockedBy).size !== blockedBy.length) {
    throw new IssueStateError(
      `Invalid issue ${candidate.id} in ${sourceLabel}. Duplicate blocker IDs are not allowed.`,
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
    blockedBy,
    filePath: candidate.filePath.trim(),
  };
}

function validateIssueBlockerGraph(issues: IssueRecord[], sourceLabel: string) {
  const issueIds = new Set(issues.map((issue) => issue.id));

  for (const issue of issues) {
    for (const blockerId of issue.blockedBy) {
      if (!issueIds.has(blockerId)) {
        throw new IssueStateError(
          `Invalid issue ${issue.id} in ${sourceLabel}. Unknown blocker ID ${blockerId}; blocker references must point to issues in the same feature.`,
        );
      }
    }
  }
}

function parseIssueMarkdown(options: {
  content: string;
  sourceLabel: string;
  featureSlug: string;
  fileName: string;
}): IssueRecord {
  const issueId = parseIssueIdFromFileName(options.fileName);

  if (!issueId) {
    throw new IssueStateError(
      `Invalid issue filename ${options.fileName} in ${options.sourceLabel}. Expected a numbered issue file such as 03-some-issue.md.`,
    );
  }

  const lines = options.content.split(/\r?\n/);
  const headingLine = lines.find((line) => /^#\s+/.test(line));

  if (!headingLine) {
    throw new IssueStateError(
      `Invalid issue ${issueId} in ${options.sourceLabel}. Expected a Markdown H1 title.`,
    );
  }

  const title = headingLine.replace(/^#\s+/, "").trim();

  if (!title) {
    throw new IssueStateError(
      `Invalid issue ${issueId} in ${options.sourceLabel}. Expected a non-empty title.`,
    );
  }

  const metadata = new Map<string, string>();

  for (const line of lines) {
    if (/^#\s+/.test(line)) {
      break;
    }

    const match = line.match(/^([A-Za-z][A-Za-z0-9-]*):\s*(.+)$/);

    if (match) {
      metadata.set(match[1].toLowerCase(), match[2].trim());
    }
  }

  const status = metadata.get("status");
  const method = metadata.get("method");
  const complexityRaw = metadata.get("complexity");
  const blockedByRaw = metadata.get("blockedby");

  if (!status) {
    throw new IssueStateError(
      `Invalid issue ${issueId} in ${options.sourceLabel}. Expected a Status header.`,
    );
  }

  if (!method) {
    throw new IssueStateError(
      `Invalid issue ${issueId} in ${options.sourceLabel}. Expected a Method header.`,
    );
  }

  if (
    !complexityRaw ||
    !/^\d+$/.test(complexityRaw) ||
    Number(complexityRaw) <= 0
  ) {
    throw new IssueStateError(
      `Invalid issue ${issueId} in ${options.sourceLabel}. Expected a positive integer Complexity header.`,
    );
  }

  if (!blockedByRaw) {
    if (/^##\s+Blocked by\s*$/im.test(options.content)) {
      throw new IssueStateError(
        `Invalid issue ${issueId} in ${options.sourceLabel}. Detected legacy prose-only blocker section; run update-blockers ${issueId} --blockers <none|id list> to normalize.`,
      );
    }

    throw new IssueStateError(
      `Invalid issue ${issueId} in ${options.sourceLabel}. Missing canonical BlockedBy header. Use BlockedBy: none or BlockedBy: <id list>.`,
    );
  }

  const blockedBy = parseBlockedByHeaderValue(
    blockedByRaw,
    issueId,
    options.sourceLabel,
  );

  const filePath = `.scratch/${options.featureSlug}/issues/${options.fileName}`;

  return validateIssueRecord(
    {
      id: issueId,
      title,
      status,
      method,
      complexity: Number(complexityRaw),
      blockedBy,
      filePath,
    },
    0,
    options.sourceLabel,
  );
}

function parseIssueIdFromFileName(fileName: string): number | null {
  const match = fileName.match(/^(\d+)/);

  if (!match) {
    return null;
  }

  const id = Number(match[1]);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseBlockedByHeaderValue(
  value: string,
  issueId: number,
  sourceLabel: string,
): number[] {
  if (value.trim().toLowerCase() === "none") {
    return [];
  }

  const parts = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  if (parts.length === 0) {
    throw new IssueStateError(
      `Invalid issue ${issueId} in ${sourceLabel}. BlockedBy must be "none" or a comma-separated list of issue IDs.`,
    );
  }

  const blockers = parts.map((part) => {
    if (!/^\d+$/.test(part)) {
      throw new IssueStateError(
        `Invalid issue ${issueId} in ${sourceLabel}. BlockedBy entries must be positive integer issue IDs.`,
      );
    }

    return Number(part);
  });

  return blockers;
}

function formatBlockedBy(blockedBy: number[]): string {
  if (blockedBy.length === 0) {
    return "none";
  }

  return blockedBy.join(", ");
}

function upsertBlockedByHeader(content: string, blockedByLine: string): string {
  const lines = content.split(/\r?\n/);
  const withoutLegacySection = removeLegacyBlockedBySection(lines);
  const working = [...withoutLegacySection];
  const firstHeadingIndex = working.findIndex((line) => /^#\s+/.test(line));
  const metadataEnd =
    firstHeadingIndex >= 0 ? firstHeadingIndex : working.length;

  const existingIndex = working.findIndex(
    (line, index) => index < metadataEnd && /^BlockedBy:\s*/i.test(line),
  );

  if (existingIndex >= 0) {
    working[existingIndex] = blockedByLine;
    return `${working.join("\n")}\n`;
  }

  const complexityIndex = working.findIndex(
    (line, index) => index < metadataEnd && /^Complexity:\s*/i.test(line),
  );

  if (complexityIndex >= 0) {
    working.splice(complexityIndex + 1, 0, blockedByLine);
    return `${working.join("\n")}\n`;
  }

  working.splice(metadataEnd, 0, blockedByLine);
  return `${working.join("\n")}\n`;
}

function removeLegacyBlockedBySection(lines: string[]): string[] {
  const start = lines.findIndex((line) => /^##\s+Blocked by\s*$/i.test(line));

  if (start < 0) {
    return lines;
  }

  let end = start + 1;

  while (end < lines.length) {
    if (/^##\s+/.test(lines[end])) {
      break;
    }

    end += 1;
  }

  const next = [...lines];
  next.splice(start, end - start);

  return next;
}
