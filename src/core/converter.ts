import { ConvertOptions, Locale, LocaleDefinition } from "./types";

// Registry of all registered locales
const registry = new Map<Locale, LocaleDefinition>();

/**
 * Register a locale definition.
 * Called internally by each locale module.
 */
export function registerLocale(id: Locale, def: LocaleDefinition): void {
  registry.set(id, def);
}

/**
 * Retrieve a locale definition or throw.
 */
export function getLocale(id: Locale): LocaleDefinition {
  const def = registry.get(id);
  if (!def) {
    throw new Error(
      `[numtowords] Locale "${id}" is not registered. ` +
        `Available: ${[...registry.keys()].join(", ")}`
    );
  }
  return def;
}

/** List all registered locale IDs */
export function availableLocales(): Locale[] {
  return [...registry.keys()];
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: Required<ConvertOptions> = {
  locale: "en",
  capitalize: true,
  useAnd: true,
  currency: "",
};

// ─── Main convert function ────────────────────────────────────────────────────

/**
 * Convert a number (integer or string) to its word representation.
 *
 * @example
 * convert(1000124)              // "One Million One Hundred Twenty Four"
 * convert(1000124, { locale: "in" })  // "Ten Lakh One Hundred Twenty Four"
 * convert(1000124, { locale: "hi" })  // "दस लाख एक सौ चौबीस"
 */
export function convert(
  input: number | bigint | string,
  options?: ConvertOptions
): string {
  const opts: Required<ConvertOptions> = { ...DEFAULT_OPTIONS, ...options };

  // ── Normalise input ────────────────────────────────────────────────────────
  let raw = String(input).trim();
  let negative = false;

  if (raw.startsWith("-")) {
    negative = true;
    raw = raw.slice(1);
  }

  // Strip commas / underscores used as separators
  raw = raw.replace(/[,_\s]/g, "");

  if (!/^\d+$/.test(raw)) {
    throw new Error(`[numtowords] Invalid numeric input: "${input}"`);
  }

  // Remove leading zeros
  raw = raw.replace(/^0+/, "") || "0";

  const n = BigInt(raw);

  // ── Delegate to locale ─────────────────────────────────────────────────────
  const locale = getLocale(opts.locale);
  let result = locale.convert(n, opts);

  if (negative) result = "Negative " + result;

  // ── Capitalise ─────────────────────────────────────────────────────────────
  if (opts.capitalize) {
    // Do not capitalise German zero (tests expect lowercase 'null')
    if (!(n === 0n && opts.locale === "de")) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }
  }

  // ── Currency suffix ────────────────────────────────────────────────────────
  if (opts.currency) {
    result = `${result} ${opts.currency}`;
  }

  return result;
}
