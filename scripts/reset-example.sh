#!/usr/bin/env bash
# reset-example.sh — Strip all Hotel Example content, reset to bare i18n skeleton.
# Idempotent: safe to run multiple times.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "========================================="
echo " Resetting Hotel Example → Skeleton"
echo "========================================="
echo ""

# ---------------------------------------------------------------------------
# 1. Remove Hotel Example pages and route group
# ---------------------------------------------------------------------------
echo "▸ Removing (marketing)/ route group..."
rm -rf "src/app/[locale]/(marketing)"

# ---------------------------------------------------------------------------
# 2. Remove Hotel Example components
# ---------------------------------------------------------------------------
echo "▸ Removing layout components..."
rm -rf "src/components/layout"

echo "▸ Removing shared components (Hotel Example)..."
rm -rf "src/components/shared"

# ---------------------------------------------------------------------------
# 3. Remove Hotel Example features
# ---------------------------------------------------------------------------
echo "▸ Removing contact feature..."
rm -rf "src/features/contact"
# Preserve the features directory with .gitkeep
mkdir -p "src/features"
touch "src/features/.gitkeep"

# ---------------------------------------------------------------------------
# 4. Remove SEO routes (Hotel-specific)
# ---------------------------------------------------------------------------
echo "▸ Removing robots.ts and sitemap.ts..."
rm -f "src/app/robots.ts"
rm -f "src/app/sitemap.ts"

# ---------------------------------------------------------------------------
# 5. Remove content data files (preserve directory structure + schemas)
# ---------------------------------------------------------------------------
echo "▸ Removing content data files..."

# Collection types — rooms
rm -rf "src/content/collection-types/rooms/en"
rm -rf "src/content/collection-types/rooms/de"
rm -rf "src/content/collection-types/rooms/el"
rm -f  "src/content/collection-types/rooms/schema.ts"

# Collection types — reviews
rm -rf "src/content/collection-types/reviews/en"
rm -rf "src/content/collection-types/reviews/de"
rm -rf "src/content/collection-types/reviews/el"
rm -f  "src/content/collection-types/reviews/schema.ts"

# Single types — homepage
rm -rf "src/content/single-types/homepage/en"
rm -rf "src/content/single-types/homepage/de"
rm -rf "src/content/single-types/homepage/el"
rm -f  "src/content/single-types/homepage/schema.ts"

# Single types — site-settings
rm -rf "src/content/single-types/site-settings/en"
rm -rf "src/content/single-types/site-settings/de"
rm -rf "src/content/single-types/site-settings/el"
rm -f  "src/content/single-types/site-settings/schema.ts"

# Media files — remove all but .gitkeep
echo "▸ Removing media files..."
find "src/content/media/files" -type f ! -name '.gitkeep' -delete 2>/dev/null || true

# Media records — remove all JSON and schema files but keep .gitkeep
echo "▸ Removing media records..."
find "src/content/media/records" -type f ! -name '.gitkeep' -delete 2>/dev/null || true

# Ensure content directories exist with .gitkeep
mkdir -p "src/content/collection-types"
mkdir -p "src/content/single-types"
mkdir -p "src/content/components"
mkdir -p "src/content/media/files"
mkdir -p "src/content/media/records"
touch "src/content/collection-types/.gitkeep"
touch "src/content/single-types/.gitkeep"
touch "src/content/components/.gitkeep"
touch "src/content/media/files/.gitkeep"
touch "src/content/media/records/.gitkeep"

# ---------------------------------------------------------------------------
# 6. Remove content loaders, types, schemas, and tests (all hotel-specific)
# ---------------------------------------------------------------------------
echo "▸ Removing hotel-specific content loaders, types, and schemas..."
rm -f "src/content/loaders.ts"
rm -f "src/content/types.ts"
rm -rf "src/content/schemas"
rm -rf "src/content/__tests__"

# ---------------------------------------------------------------------------
# 7. Remove content test fixtures (all hotel-specific)
# ---------------------------------------------------------------------------
echo "▸ Removing content test fixtures..."
rm -rf "src/test/fixtures/content"
rm -rf "src/test/fixtures/content-invalid"

# ---------------------------------------------------------------------------
# 8. Remove Hotel Example E2E tests (keep not-found.spec.ts and .gitkeep)
# ---------------------------------------------------------------------------
echo "▸ Removing Hotel Example E2E tests..."
rm -f "e2e/homepage.spec.ts"
rm -f "e2e/rooms.spec.ts"
rm -f "e2e/navigation.spec.ts"
rm -f "e2e/contact.spec.ts"

# ---------------------------------------------------------------------------
# 9. Create skeleton [locale]/page.tsx
# ---------------------------------------------------------------------------
echo "▸ Creating skeleton page..."
mkdir -p "src/app/[locale]"

cat > "src/app/[locale]/page.tsx" << 'PAGEEOF'
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Skeleton" });
  return {
    title: t("welcome"),
  };
}

export default async function SkeletonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Skeleton" });

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <h1 className="text-4xl font-bold">{t("welcome")}</h1>
    </div>
  );
}
PAGEEOF

# ---------------------------------------------------------------------------
# 10. Reset message files to skeleton
# ---------------------------------------------------------------------------
echo "▸ Resetting message files to skeleton..."

cat > "src/messages/en.json" << 'MSGEOF'
{
  "Skeleton": {
    "welcome": "Welcome."
  }
}
MSGEOF

cat > "src/messages/el.json" << 'MSGEOF'
{
  "Skeleton": {
    "welcome": "Καλώς ήρθατε."
  }
}
MSGEOF

cat > "src/messages/de.json" << 'MSGEOF'
{
  "Skeleton": {
    "welcome": "Willkommen."
  }
}
MSGEOF

# ---------------------------------------------------------------------------
# 11. Strip hotel-specific env vars from env.ts
# ---------------------------------------------------------------------------
echo "▸ Cleaning env.ts (removing hotel-specific vars)..."

cat > "src/env.ts" << 'ENVEOF'
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

const parsedEnv = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsedEnv.data;
ENVEOF

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo "========================================="
echo " Reset complete."
echo "========================================="
echo ""
echo " Removed:"
echo "   - (marketing)/ route group"
echo "   - src/components/layout/"
echo "   - src/components/shared/"
echo "   - src/features/contact/"
echo "   - src/app/robots.ts, src/app/sitemap.ts"
echo "   - All content data files (dirs preserved)"
echo "   - Content loaders, types, schemas, tests"
echo "   - Content test fixtures"
echo "   - Hotel E2E specs (homepage, rooms, navigation, contact)"
echo ""
echo " Preserved:"
echo "   - Root layout, globals.css, favicon.ico, not-found.tsx"
echo "   - [locale]/layout.tsx (providers)"
echo "   - shadcn components (src/components/ui/)"
echo "   - IntlErrorHandlingProvider (src/components/providers/)"
echo "   - Shared utilities (src/shared/)"
echo "   - i18n infrastructure (src/i18n/)"
echo "   - Middleware (src/proxy.ts)"
echo "   - Test setup (src/test/setup.ts, button.test.tsx)"
echo "   - E2E: not-found.spec.ts"
echo "   - All config files"
echo ""
echo " Created:"
echo "   - src/app/[locale]/page.tsx (skeleton)"
echo "   - Skeleton message files (en, el, de)"
echo "   - Cleaned env.ts"
echo ""
