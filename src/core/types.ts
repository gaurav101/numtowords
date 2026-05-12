// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

/** Supported locale identifiers */
export type Locale = "en" | "in" | "hi" | "de" | "fr" | (string & {});

/** Options passed to convert() */
export interface ConvertOptions {
  /**
   * Target locale / numeral system.
   * - `"en"` — English (International):  1,000,000 = One Million
   * - `"in"` — Indian numbering system:  10,00,000 = Ten Lakh
   * - `"hi"` — Hindi words (Indian system): दस लाख
   * - `"de"` — German
   * - `"fr"` — French
   * @default "en"
   */
  locale?: Locale;

  /** Capitalise the first letter of the result. @default true */
  capitalize?: boolean;

  /** Include "and" connector where applicable (English only). @default true */
  useAnd?: boolean;

  /**
   * Currency mode — append currency labels.
   * e.g. { currency: "USD" } → "One Million Dollars"
   */
  currency?: string;
}

/** Internal locale definition contract */
export interface LocaleDefinition {
  /** Human-readable name */
  name: string;
  /** Convert an integer ≥ 0 to words */
  convert(n: bigint, opts: Required<ConvertOptions>): string;
}
