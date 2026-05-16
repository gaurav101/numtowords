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
 * Indian scale names (each 100× the previous after thousand):
 *   1,000         = thousand
 *   1,00,000      = lakh
 *   1,00,00,000   = crore
 *   1,00,00,00,000 = arab (not commonly used in English but included)
 *   …
 */
const INDIAN_SCALES: [bigint, string][] = [
  [100000000000000000n, 'shankh'], // 10^17
  [1000000000000000n, 'padma'], // 10^15
  [10000000000000n, 'neel'], // 10^13
  [100000000000n, 'kharab'], // 10^11
  [1000000000n, 'arab'], // 10^9
  [10000000n, 'crore'], // 10^7
  [100000n, 'lakh'], // 10^5
  [1000n, 'thousand'],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function twoDigits(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`;
}

function hundredsToWords(n: number): string {
  if (n === 0) return '';
  const h = Math.floor(n / 100);
  const rem = n % 100;
  const parts: string[] = [];
  if (h > 0) parts.push(`${ONES[h]} hundred`);
  const two = twoDigits(rem);
  if (two) parts.push(two);
  return parts.join(' ');
}

// ─── Locale definition ────────────────────────────────────────────────────────

const indian: LocaleDefinition = {
  name: 'Indian',
  decimalPoint: 'point',
  decimalDigits: ['zero', ...ONES.slice(1, 10)],

  convert(n: bigint, _opts: Required<ConvertOptions>): string {
    if (n === 0n) return 'zero';

    const parts: string[] = [];
    let remaining = n;

    for (const [scale, name] of INDIAN_SCALES) {
      if (remaining >= scale) {
        const count = remaining / scale;
        remaining = remaining % scale;

        // The count itself may need Indian-style words
        // For counts < 1000 we use simple English words
        const countWords = hundredsToWords(Number(count));
        parts.push(`${countWords} ${name}`);
      }
    }

    // Anything left is < 1000
    if (remaining > 0n) {
      parts.push(hundredsToWords(Number(remaining)));
    }

    return parts.join(' ');
  },
};

registerLocale('in', indian);

export default indian;
