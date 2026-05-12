import { registerLocale } from '../core/converter';
import { LocaleDefinition, ConvertOptions } from '../core/types';

// ─── Word tables ──────────────────────────────────────────────────────────────

const ONES_DE = [
  '',
  'ein',
  'zwei',
  'drei',
  'vier',
  'fünf',
  'sechs',
  'sieben',
  'acht',
  'neun',
  'zehn',
  'elf',
  'zwölf',
  'dreizehn',
  'vierzehn',
  'fünfzehn',
  'sechzehn',
  'siebzehn',
  'achtzehn',
  'neunzehn',
];

const TENS_DE = [
  '',
  '',
  'zwanzig',
  'dreißig',
  'vierzig',
  'fünfzig',
  'sechzig',
  'siebzig',
  'achtzig',
  'neunzig',
];

/** German uses "und" between ones and tens: einundzwanzig */
function upToNinetyNine(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES_DE[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (o === 0) return TENS_DE[t];
  return `${ONES_DE[o]}und${TENS_DE[t]}`;
}

function hundredsDE(n: number): string {
  if (n === 0) return '';
  const h = Math.floor(n / 100);
  const rem = n % 100;
  const parts: string[] = [];
  if (h === 1) parts.push('einhundert');
  else if (h > 1) parts.push(`${ONES_DE[h]}hundert`);
  if (rem > 0) parts.push(upToNinetyNine(rem));
  return parts.join('');
}

const SCALES_DE = [
  'tausend',
  'Million',
  'Milliarde',
  'Billion',
  'Billiarde',
  'Trillion',
];

/** Scales that are grammatically feminine in German (require "eine" not "ein") */
const FEMININE_SCALES = new Set([1, 2, 4, 6]); // indices: Million, Milliarde, Billiarde, Trillion

const SCALES_DE_PLURAL = [
  'tausend',
  'Millionen',
  'Milliarden',
  'Billionen',
  'Billiarden',
  'Trillionen',
];

// ─── Locale definition ────────────────────────────────────────────────────────

const de: LocaleDefinition = {
  name: 'German',

  convert(n: bigint, _opts: Required<ConvertOptions>): string {
    if (n === 0n) return 'null';

    const chunks: { value: number; scale: number }[] = [];
    let remaining = n;
    let idx = 0;
    while (remaining > 0n) {
      chunks.unshift({ value: Number(remaining % 1000n), scale: idx });
      remaining = remaining / 1000n;
      idx++;
    }

    const parts: string[] = [];

    for (const { value, scale } of chunks) {
      if (value === 0) continue;
      const words = hundredsDE(value);

      if (scale === 0) {
        parts.push(words);
      } else if (scale === 1) {
        // "tausend" compounds directly
        parts.push(`${words}tausend`);
      } else {
        const scaleIdx = scale - 1;
        const isFeminine = FEMININE_SCALES.has(scaleIdx);
        // Replace trailing "ein" with "eine" for feminine scales
        const adjustedWords =
          value === 1 && isFeminine ? words.replace(/ein$/, 'eine') : words;
        const scaleName =
          value === 1 ? SCALES_DE[scaleIdx] : SCALES_DE_PLURAL[scaleIdx];
        parts.push(`${adjustedWords} ${scaleName}`);
      }
    }

    return parts.join(' ').trim();
  },
};

registerLocale('de', de);

export default de;
