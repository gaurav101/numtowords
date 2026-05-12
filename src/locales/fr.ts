import { registerLocale } from '../core/converter';
import { LocaleDefinition, ConvertOptions } from '../core/types';

// ─── Word tables ──────────────────────────────────────────────────────────────

const ONES_FR = [
  '',
  'un',
  'deux',
  'trois',
  'quatre',
  'cinq',
  'six',
  'sept',
  'huit',
  'neuf',
  'dix',
  'onze',
  'douze',
  'treize',
  'quatorze',
  'quinze',
  'seize',
  'dix-sept',
  'dix-huit',
  'dix-neuf',
];

const TENS_FR = [
  '',
  '',
  'vingt',
  'trente',
  'quarante',
  'cinquante',
  'soixante',
  'soixante',
  'quatre-vingt',
  'quatre-vingt',
];

/**
 * French has irregular 70s (soixante-dix + 10–19) and 90s (quatre-vingt-dix + 10–19).
 */
function upToNinetyNine(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES_FR[n];

  const t = Math.floor(n / 10);
  const o = n % 10;

  if (t === 7) {
    // soixante + (10 + o)
    return o === 0 ? 'soixante-dix' : `soixante-${ONES_FR[10 + o]}`;
  }
  if (t === 8) {
    // quatre-vingt(s) + o
    if (o === 0) return 'quatre-vingts';
    return `quatre-vingt-${ONES_FR[o]}`;
  }
  if (t === 9) {
    // quatre-vingt-dix + (0 + o)
    return o === 0 ? 'quatre-vingt-dix' : `quatre-vingt-${ONES_FR[10 + o]}`;
  }

  if (o === 0) return TENS_FR[t];
  if (o === 1 && t !== 8) return `${TENS_FR[t]}-et-${ONES_FR[o]}`;
  return `${TENS_FR[t]}-${ONES_FR[o]}`;
}

function hundredsFR(n: number): string {
  if (n === 0) return '';
  const h = Math.floor(n / 100);
  const rem = n % 100;
  const parts: string[] = [];

  if (h === 1) {
    parts.push('cent');
  } else if (h > 1) {
    parts.push(`${ONES_FR[h]} cents`);
  }

  if (rem > 0) {
    // remove trailing 's' from "cents" if followed by more words
    if (h > 1 && parts.length > 0) {
      parts[0] = `${ONES_FR[h]} cent`;
    }
    parts.push(upToNinetyNine(rem));
  }

  return parts.join(' ');
}

const SCALES_FR = [
  'mille',
  'million',
  'milliard',
  'billion',
  'billiard',
  'trillion',
];

const SCALES_FR_PLURAL = [
  'mille',
  'millions',
  'milliards',
  'billions',
  'billiards',
  'trillions',
];

// ─── Locale definition ────────────────────────────────────────────────────────

const fr: LocaleDefinition = {
  name: 'French',

  convert(n: bigint, _opts: Required<ConvertOptions>): string {
    if (n === 0n) return 'zéro';

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
      const words = hundredsFR(value);

      if (scale === 0) {
        parts.push(words);
      } else if (scale === 1) {
        // "mille" does not pluralise and drops "un" prefix
        parts.push(value === 1 ? 'mille' : `${words} mille`);
      } else {
        const scaleIdx = scale - 1;
        const scaleName =
          value === 1 ? SCALES_FR[scaleIdx] : SCALES_FR_PLURAL[scaleIdx];
        parts.push(`${words} ${scaleName}`);
      }
    }

    return parts.join(' ').trim();
  },
};

registerLocale('fr', fr);

export default fr;
