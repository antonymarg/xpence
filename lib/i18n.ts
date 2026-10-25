import { locales } from "@/constants/locale";
import type { Locale } from "@/types/users.types";
import i18next from "i18next";

async function setAppLanguage(locale: Locale): Promise<void> {
  const language = locales.find((option) => option.code === locale);
  if (!language) throw new Error(`Unsupported locale: ${locale}`);
  await i18next.changeLanguage(language.languageTag);
}

export { setAppLanguage };