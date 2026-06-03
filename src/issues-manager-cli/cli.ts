import {
  FEATURE_STATUSES,
  FeatureStateError,
  readFeaturesState,
  resolveCurrentFeature,
  updateFeatureStatus,
} from "./features-state";
import {
  getActionableIssues,
  IssueStateError,
  readIssuesState,
  regenerateIssuesStateFromIssueFiles,
  resolveFeatureForIssueRead,
  updateIssueBlockers,
} from "./issues-state";

export type CliResult = {
  exitCode: number;
  stderr: string;
  stdout: string;
};

export async function runIssuesManagerCli(
  args: string[],
  options: { cwd: string },
): Promise<CliResult> {
  try {
    if (args[0] === "list-issues") {
      const featureFlagIndex = args.indexOf("--feature");
      const actionableOnly = args.includes("--actionable");
      const state = await readFeaturesState(options.cwd);
      const featureSlug = resolveFeatureForIssueRead(
        state,
        featureFlagIndex >= 0 ? args[featureFlagIndex + 1] : undefined,
      ).slug;

      if (!featureSlug) {
        throw new FeatureStateError(
          "Usage: list-issues [--feature <slug>] [--actionable]",
        );
      }

      const issuesState = await readIssuesState(options.cwd, featureSlug);
      const issues = actionableOnly
        ? getActionableIssues(issuesState)
        : issuesState.issues;

      return {
        exitCode: 0,
        stderr: "",
        stdout: [
          actionableOnly ? "Feature issues (actionable)" : "Feature issues",
          `id: ${issuesState.featureId}`,
          `slug: ${issuesState.featureSlug}`,
          `status: ${issuesState.featureStatus ?? "unknown"}`,
          ...issues.flatMap((issue) => [
            "",
            `${issue.id}. ${issue.title}`,
            `status: ${issue.status}`,
            `method: ${issue.method}`,
            `complexity: ${issue.complexity}`,
            `path: ${issue.filePath}`,
          ]),
        ].join("\n"),
      };
    }

    if (args[0] === "get-feature") {
      const state = await readFeaturesState(options.cwd);
      const feature = resolveCurrentFeature(state);

      return {
        exitCode: 0,
        stderr: "",
        stdout: [
          "Current feature",
          `id: ${feature.id}`,
          `slug: ${feature.slug}`,
          `status: ${feature.status}`,
        ].join("\n"),
      };
    }

    if (args[0] === "update-feature") {
      const slug = args[1];
      const statusFlagIndex = args.indexOf("--status");
      const status =
        statusFlagIndex >= 0 ? args[statusFlagIndex + 1] : undefined;

      if (!slug || !status) {
        throw new FeatureStateError(
          "Usage: update-feature <slug> --status <todo|in-progress|archived>",
        );
      }

      if (
        !FEATURE_STATUSES.includes(status as (typeof FEATURE_STATUSES)[number])
      ) {
        throw new FeatureStateError(
          `Invalid feature status "${status}". Expected one of: ${FEATURE_STATUSES.join(", ")}.`,
        );
      }

      const feature = await updateFeatureStatus({
        cwd: options.cwd,
        slug,
        status: status as (typeof FEATURE_STATUSES)[number],
      });

      return {
        exitCode: 0,
        stderr: "",
        stdout: [
          "Updated feature",
          `id: ${feature.id}`,
          `slug: ${feature.slug}`,
          `status: ${feature.status}`,
        ].join("\n"),
      };
    }

    if (args[0] === "update-blockers") {
      const issueIdRaw = args[1];
      const blockersFlagIndex = args.indexOf("--blockers");
      const featureFlagIndex = args.indexOf("--feature");
      const blockersRaw =
        blockersFlagIndex >= 0 ? args[blockersFlagIndex + 1] : undefined;

      if (!issueIdRaw || !blockersRaw) {
        throw new IssueStateError(
          "Usage: update-blockers <issue-id> --blockers <none|id[,id...]> [--feature <slug>]",
        );
      }

      const issueId = Number(issueIdRaw);

      if (!Number.isInteger(issueId) || issueId <= 0) {
        throw new IssueStateError(
          `Invalid issue id "${issueIdRaw}". Expected a positive integer issue id.`,
        );
      }

      const blockedBy = parseBlockedByArgument(blockersRaw);
      const state = await readFeaturesState(options.cwd);
      const feature = resolveFeatureForIssueRead(
        state,
        featureFlagIndex >= 0 ? args[featureFlagIndex + 1] : undefined,
      );

      const update = await updateIssueBlockers({
        cwd: options.cwd,
        feature,
        issueId,
        blockedBy,
      });

      // Re-validate the regenerated state explicitly as a feature-wide guard.
      await regenerateIssuesStateFromIssueFiles({
        cwd: options.cwd,
        feature,
      });

      return {
        exitCode: 0,
        stderr: "",
        stdout: [
          "Updated blockers",
          `feature: ${update.featureSlug}`,
          `issue: ${update.issueId}`,
          `blockedBy: ${update.blockedBy.length > 0 ? update.blockedBy.join(", ") : "none"}`,
          `path: ${update.issuePath}`,
        ].join("\n"),
      };
    }

    return {
      exitCode: 1,
      stderr:
        "Unknown command. Supported commands: list-issues, get-feature, update-feature, update-blockers.",
      stdout: "",
    };
  } catch (error) {
    if (
      error instanceof FeatureStateError ||
      error instanceof IssueStateError
    ) {
      return {
        exitCode: 1,
        stderr: error.message,
        stdout: "",
      };
    }

    throw error;
  }
}

function parseBlockedByArgument(value: string): number[] {
  if (value.trim().toLowerCase() === "none") {
    return [];
  }

  const parts = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  if (parts.length === 0) {
    throw new IssueStateError(
      "Invalid blockers value. Use --blockers none or --blockers <id[,id...]>",
    );
  }

  return parts.map((part) => {
    if (!/^\d+$/.test(part) || Number(part) <= 0) {
      throw new IssueStateError(
        `Invalid blocker id "${part}". Blocker IDs must be positive integers.`,
      );
    }

    return Number(part);
  });
}

export async function runIssuesManagerCliMain(
  args: string[],
  options?: { cwd?: string },
): Promise<number> {
  const result = await runIssuesManagerCli(args, {
    cwd: options?.cwd ?? process.cwd(),
  });

  if (result.stdout) {
    process.stdout.write(`${result.stdout}\n`);
  }

  if (result.stderr) {
    process.stderr.write(`${result.stderr}\n`);
  }

  return result.exitCode;
}
