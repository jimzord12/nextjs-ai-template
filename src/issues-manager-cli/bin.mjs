#!/usr/bin/env node

import {
  FEATURE_STATUSES,
  FeatureStateError,
  readFeaturesState,
  resolveCurrentFeature,
  updateFeatureStatus,
} from "./features-state.ts";

async function runIssuesManagerCli(args, options) {
  try {
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

      if (!FEATURE_STATUSES.includes(status)) {
        throw new FeatureStateError(
          `Invalid feature status "${status}". Expected one of: ${FEATURE_STATUSES.join(", ")}.`,
        );
      }

      const feature = await updateFeatureStatus({
        cwd: options.cwd,
        slug,
        status,
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
        "Unknown command. Supported commands: get-feature, update-feature.",
      stdout: "",
    };
  } catch (error) {
    if (error instanceof FeatureStateError) {
      return {
        exitCode: 1,
        stderr: error.message,
        stdout: "",
      };
    }

    throw error;
  }
}

async function main() {
  const result = await runIssuesManagerCli(process.argv.slice(2), {
    cwd: process.cwd(),
  });

  if (result.stdout) {
    process.stdout.write(`${result.stdout}\n`);
  }

  if (result.stderr) {
    process.stderr.write(`${result.stderr}\n`);
  }

  process.exitCode = result.exitCode;
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
