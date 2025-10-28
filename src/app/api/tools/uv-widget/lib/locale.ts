import type { LocaleLanguage } from "./types";

const SUPPORTED_LANGUAGES: Record<LocaleLanguage, { defaultLocale: string }> = {
  en: { defaultLocale: "en-US" },
  pl: { defaultLocale: "pl-PL" },
};

function normaliseLanguageCode(raw: string | null | undefined): LocaleLanguage {
  if (!raw) {
    return "pl";
  }

  const candidate = raw.trim().toLowerCase();
  const language = candidate.split(/[-_]/)[0] as LocaleLanguage;

  if (language && language in SUPPORTED_LANGUAGES) {
    return language;
  }

  return "en";
}

function deriveLocale(language: LocaleLanguage, raw?: string | null) {
  if (!raw) {
    return SUPPORTED_LANGUAGES[language].defaultLocale;
  }

  const candidate = raw.trim();
  if (!candidate) {
    return SUPPORTED_LANGUAGES[language].defaultLocale;
  }

  const [langPart, regionPart] = candidate.split(/[-_]/);
  if (!langPart) {
    return SUPPORTED_LANGUAGES[language].defaultLocale;
  }

  if (!regionPart) {
    return `${langPart.toLowerCase()}-${SUPPORTED_LANGUAGES[language].defaultLocale.split("-")[1]}`;
  }

  return `${langPart.toLowerCase()}-${regionPart.toUpperCase()}`;
}

export function inferLocale(explicit: string | null, acceptLanguage: string | null) {
  const primaryCandidate = explicit ?? acceptLanguage?.split(",")[0] ?? null;
  const language = normaliseLanguageCode(primaryCandidate);
  const locale = deriveLocale(language, primaryCandidate);

  return { language, locale };
}
