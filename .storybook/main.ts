import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const require = createRequire(import.meta.url);

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [getAbsolutePath("@storybook/react-vite")],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  } as unknown as Record<string, unknown>,
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Path aliases from tsconfig
      "@": join(projectRoot, "src"),
      "@src": join(projectRoot, "src"),
      "@shared": join(projectRoot, "src/shared"),
      // Mock Next.js and next-intl modules for Storybook
      "next/image": join(projectRoot, ".storybook/mocks/next-image.tsx"),
      "next/link": join(projectRoot, ".storybook/mocks/next-link.tsx"),
      "@/i18n/navigation": join(
        projectRoot,
        ".storybook/mocks/next-intl-navigation.tsx",
      ),
    };

    return config;
  },
};
export default config;
