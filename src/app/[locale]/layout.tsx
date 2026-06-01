import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { IntlErrorHandlingProvider } from "@/components/providers/intl-error-provider";
import { env } from "@/env";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: env.NEXT_PUBLIC_SITE_URL
      ? new URL(env.NEXT_PUBLIC_SITE_URL)
      : undefined,
    title: {
      default: "My App",
      template: "%s | My App",
    },
    description: "A Next.js static site template.",
    alternates: {
      canonical: `/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <IntlErrorHandlingProvider locale={locale} messages={messages}>
          {children}
        </IntlErrorHandlingProvider>
      </body>
    </html>
  );
}
