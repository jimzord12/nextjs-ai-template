import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import de from "../messages/de.json";
import el from "../messages/el.json";
// Static imports for each locale — required because Turbopack cannot resolve
// fully dynamic template-literal specifiers.
import en from "../messages/en.json";
import { routing } from "./routing";

const messageMap: Record<string, Record<string, Record<string, string>>> = {
  en,
  el,
  de,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messageMap[locale],
    onError(error) {
      if (error.code === "MISSING_MESSAGE") {
        console.error(`[next-intl] Missing message:`, error);
      } else {
        console.error(`[next-intl] Error:`, error);
      }
    },
    getMessageFallback({ namespace, key, error }) {
      if (error.code === "MISSING_MESSAGE") {
        return `${namespace ? `${namespace}.` : ""}${key} (not translated)`;
      }
      return `Dear developer, something went wrong: ${error.message}`;
    },
  };
});
