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
