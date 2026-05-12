// ─── Register all built-in locales ───────────────────────────────────────────
import "./locales/en";
import "./locales/in";
import "./locales/hi";
import "./locales/de";
import "./locales/fr";

// ─── Re-export public API ─────────────────────────────────────────────────────
export { convert, registerLocale, getLocale, availableLocales } from "./core/converter";
export type { Locale, ConvertOptions, LocaleDefinition } from "./core/types";
