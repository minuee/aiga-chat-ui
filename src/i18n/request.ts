import { getRequestConfig } from "next-intl/server";
import { Locale, routing } from "./routing";
import { cookies } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale:any = await requestLocale;
  if ( locale === undefined ) {
    const cookieStore = await cookies();
    locale = cookieStore.get("x-current-path")?.value?.includes("/ja") ? "ja" : null;
  }

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locale)) {
   locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});