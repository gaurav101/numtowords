import { registerLocale } from '../core/converter';
import { LocaleDefinition, ConvertOptions } from '../core/types';

// ─── Word tables ──────────────────────────────────────────────────────────────

const ONES = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

/**
 * Scale names in the short (American/modern British) scale.
 * Index 0 = thousands, 1 = millions, …
 */
const SCALES = [
  'thousand',
  'million',
  'billion',
  'trillion',
  'quadrillion',
  'quintillion',
  'sextillion',
  'septillion',
  'octillion',
  'nonillion',
  'decillion',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert 0–999 to words */
function hundredsToWords(n: number, useAnd: boolean): string {
  if (n === 0) return '';

  const parts: string[] = [];
  const h = Math.floor(n / 100);
  const remainder = n % 100;

  if (h > 0) {
    parts.push(`${ONES[h]} hundred`);
  }

  if (remainder === 0) {
    // nothing more
  } else {
    if (h > 0 && useAnd) parts.push('and');
    if (remainder < 20) {
      parts.push(ONES[remainder]);
    } else {
      const t = Math.floor(remainder / 10);
      const o = remainder % 10;
      parts.push(o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`);
    }
  }

  return parts.join(' ');
}

// ─── Locale definition ────────────────────────────────────────────────────────

const en: LocaleDefinition = {
  name: 'English',
  decimalPoint: 'point',
  decimalDigits: ['zero', ...ONES.slice(1, 10)],

  convert(n: bigint, opts: Required<ConvertOptions>): string {
    if (n === 0n) return 'zero';

    const useAnd = opts.useAnd;
    const chunks: { value: number; scale: number }[] = [];

    // Split number into groups of 3 from the right
    let remaining = n;
    const divisor = 1000n;

    // chunk index: 0 = units, 1 = thousands, 2 = millions, …
    let idx = 0;
    while (remaining > 0n) {
      chunks.unshift({ value: Number(remaining % divisor), scale: idx });
      remaining = remaining / divisor;
      idx++;
    }

    const parts: string[] = [];

    for (const { value, scale } of chunks) {
      if (value === 0) continue;

      // useAnd within the hundreds group (e.g. "one hundred and five")
      const words = hundredsToWords(value, useAnd);

      if (scale === 0) {
        parts.push(words);
      } else {
        const scaleName = SCALES[scale - 1];
        parts.push(`${words} ${scaleName}`);
      }
    }

    return parts.join(' ');
  },
};

registerLocale('en', en);

export default en;
