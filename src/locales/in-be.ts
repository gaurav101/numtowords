import {ConvertOptions, LocaleDefinition} from "../core/types";
import {registerLocale} from "../core/converter";

const BENGALI_ONES: Record<number, string> = {
    1: 'এক',
    2: 'দুই',
    3: 'তিন',
    4: 'চার',
    5: 'পাঁচ',
    6: 'ছয়',
    7: 'সাত',
    8: 'আট',
    9: 'নয়',
    10: 'দশ',
    11: 'এগারো',
    12: 'বারো',
    13: 'তেরো',
    14: 'চৌদ্দ',
    15: 'পંદર',
    16: 'ষোলো',
    17: 'সতেরো',
    18: 'আঠারো',
    19: 'উনিশ',
    20: 'বিশ',
    21: 'একুশ',
    22: 'বাইশ',
    23: 'তেইশ',
    24: 'চব্বিশ',
    25: 'পঁচিশ',
    26: 'ছাব্বিশ',
    27: 'সাতাশ',
    28: 'আঠাশ',
    29: 'উনত্রিশ',
    30: 'ত্রিশ',
    31: 'একত্রিশ',
    32: 'বত্রিশ',
    33: 'তেত্রিশ',
    34: 'চৌত্রিশ',
    35: 'পঁয়ত্রিশ',
    36: 'ছত্রিশ',
    37: 'সাতত্রিশ',
    38: 'আड़ত্রিশ',
    39: 'উনচল্লিশ',
    40: 'চল্লিশ',
    41: 'একচল্লিশ',
    42: 'বিয়াল্লিশ',
    43: 'তেতাল্লিশ',
    44: 'চুয়াল্লিশ',
    45: 'পঁয়তাল্লিশ',
    46: 'ছিয়তাল্লিশ',
    47: 'সাতচল্লিশ',
    48: 'আड़তাল্লিশ',
    49: 'উনপঞ্চাশ',
    50: 'পঞ্চাশ',
    51: 'একান্ন',
    52: 'বাহাবান্ন',
    53: 'তিপ্পান্ন',
    54: 'চৌরান্ন',
    55: 'পঞ্চান্ন',
    56: 'ছ্পান্ন',
    57: 'সัตপঞ্চাশ',
    58: 'আটপঞ্চাশ',
    59: 'উনষাট',
    60: 'ষাট',
    61: 'একষট্টি',
    62: 'বাষট্টি',
    63: 'তিষট্টি',
    64: 'চৌষট্টি',
    65: 'পঁয়ষট্টি',
    66: 'ছিয়ষট্টি',
    67: 'সাতষট্টি',
    68: 'আটষট্টি',
    69: 'উনসত্তর',
    70: 'সত্তর',
    71: 'इक সত্তর', // Note: Bengali often uses a simpler structure for higher numbers, but following the pattern.
    72: 'বাহাত্তর',
    73: 'তিয়াত্তর',
    74: 'চৌাত্তর',
    75: 'পঁচাত্তর',
    76: 'ছিয়াত্তর',
    77: 'সัตছত্তর',
    78: 'আঠাত্তর',
    79: 'উনআশি',
    80: 'আশি',
    81: 'একআশি',
    82: 'বিয়াশি',
    83: 'তিরাশি',
    84: 'চুরাশি',
    85: 'পঁচাশি',
    86: 'ছিয়াত্তর', // Note: This number is often grouped differently in Bengali context.
    87: 'সাতআশি',
    88: 'আটআশি',
    89: 'উননব্বই',
    90: 'নব্বই',
    91: 'একানব্বই',
    92: 'বানানব্বই',
    93: 'তিরানব্বই',
    94: 'চুরানব্বই',
    95: 'পঁচানব্বই',
    96: 'ছিয়ানব্বই',
    97: 'সাতানব্বই',
    98: 'অটানব্বই',
    99: 'নিরানব্বই',
};

const BENGALI_HUNDRED = 'শত'; // Hundred

// Place value definitions for Bengali (using standard Indian/Bengali terms)
const INDIAN_SCALES_BN: [bigint, string][] = [
    [100000000000000000n, 'শঙ্খ'], // 10^17 (Shankh - Shell/Conch)
    [1000000000000000n, 'পদ্ম'],   // 10^15 (Padma - Lotus)
    [10000000000000n, 'নীল'],      // 10^13 (Neel - Blue)
    [1000000000000n, 'লক্ষ'],      // 10^11 (Lakh/Koti scale equivalent)
    [100000000000n, 'কোটি'],       // 10^9 (Crore/Arb scale equivalent)
    [1000000000n, 'অৰব'],         // 10^9 (Arab)
    [10000000n, 'কোটি'],          // 10^7 (Crore scale equivalent)
    [100000n, 'লক্ষ'],           // 10^5 (Lakh)
    [1000n, 'হাজার'],             // 10^3 (Hazar)
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function upToNinetyNine(n: number): string {
    return BENGALI_ONES[n] ?? '';
}

function hundredsBengali(n: number): string {
    if (n === 0) return '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    const parts: string[] = [];
    if (h > 0) {

        parts.push(`${upToNinetyNine(h)} ${BENGALI_HUNDRED}`);
    }
    if (rem > 0) parts.push(upToNinetyNine(rem));
    return parts.join(' ');
}

// ─── Locale definition ────────────────────────────────────────────────────────

const in_be: LocaleDefinition = {
    name: 'Bengali',

    convert(n: bigint, _opts: Required<ConvertOptions>): string {
        if (n === 0n) return 'শূন্য';

        const parts: string[] = [];
        let remaining = n;

        for (const [scale, name] of INDIAN_SCALES_BN) {
            if (remaining >= scale) {
                const count = remaining / scale;
                remaining = remaining % scale;
                const countWords = hundredsBengali(Number(count));
                parts.push(`${countWords} ${name}`);
            }
        }

        if (remaining > 0n) {
            parts.push(hundredsBengali(Number(remaining)));
        }

        return parts.join(' ');
    },
};

registerLocale('in-be', in_be);

export default in_be;

