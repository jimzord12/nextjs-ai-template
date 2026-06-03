import {
  FEATURE_STATUSES,
  FeatureStateError,
  readFeaturesState,
  resolveCurrentFeature,
  updateFeatureStatus,
} from "./features-state";
import {
  IssueStateError,
  readIssuesState,
  resolveFeatureForIssueRead,
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
      const state = await readFeaturesState(options.cwd);
      const featureSlug = resolveFeatureForIssueRead(
        state,
        featureFlagIndex >= 0 ? args[featureFlagIndex + 1] : undefined,
      ).slug;

      if (!featureSlug) {
        throw new FeatureStateError(
          "Usage: list-issues [--feature <slug>]",
        );
      }

      const issuesState = await readIssuesState(options.cwd, featureSlug);

      return {
        exitCode: 0,
        stderr: "",
        stdout: [
          "Feature issues",
          `id: ${issuesState.featureId}`,
          `slug: ${issuesState.featureSlug}`,
          `status: ${issuesState.featureStatus ?? "unknown"}`,
          ...issuesState.issues.flatMap((issue) => [
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

      if (!FEATURE_STATUSES.includes(status as (typeof FEATURE_STATUSES)[number])) {
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

    return {
      exitCode: 1,
      stderr:
        "Unknown command. Supported commands: list-issues, get-feature, update-feature.",
      stdout: "",
    };
  } catch (error) {
    if (error instanceof FeatureStateError || error instanceof IssueStateError) {
      return {
        exitCode: 1,
        stderr: error.message,
        stdout: "",
      };
    }

    throw error;
  }
}