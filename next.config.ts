import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

// Bundle analyzer: enabled only when ANALYZE=true
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  // biome-ignore lint/style/noProcessEnv: bundle analyzer is opt-in via env var
  enabled: process.env.ANALYZE === "true",
});

const wrappedConfig = withBundleAnalyzer(nextConfig);

export default withNextIntl(wrappedConfig);
