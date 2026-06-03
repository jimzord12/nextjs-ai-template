"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

type Props = {
  locale: string;
  messages: Record<string, Record<string, string>>;
  children: ReactNode;
};

export function IntlErrorHandlingProvider({
  locale,
  messages,
  children,
}: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(error) => {
        if (error.code === "MISSING_MESSAGE") {
          console.error(`[next-intl] Missing message:`, error);
        } else {
          console.error(`[next-intl] Error:`, error);
        }
      }}
      getMessageFallback={({ namespace, key, error }) => {
        if (error.code === "MISSING_MESSAGE") {
          return `${namespace ? `${namespace}.` : ""}${key} (not translated)`;
        }
        return `Dear developer, something went wrong: ${error.message}`;
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
