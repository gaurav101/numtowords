# @gks101/numtowords

[![bundle size](https://badgen.net/bundlephobia/minzip/react)](https://bundlephobia.com/package/@gks101/numtowords) [![license](https://img.shields.io/badge/license-MIT-green)](LICENSE) [![tree shaking](https://badgen.net/bundlephobia/tree-shaking/react-colorful)](https://bundlephobia.com/package/@gks101/numtowords) [![dependency count](https://badgen.net/bundlephobia/dependency-count/react-colorful)](https://bundlephobia.com/package/@gks101/numtowords)

Convert numbers to words in **multiple languages and numeral systems** — English, Indian, Hindi, German, French — with full TypeScript support,zero dependencies and < 3kb size.

```
convert(1_000_124)                       // "One million one hundred and twenty-four"
convert(1_000_124, { locale: "in" })    // "Ten lakh one hundred twenty-four"
convert(1_000_124, { locale: "hi" })    // "दस लाख एक सौ चौबीस"
convert(1_000_124, { locale: "de" })    // "Eine Million einhundertvierundzwanzig"
convert(1_000_124, { locale: "fr" })    // "Un million cent vingt-quatre"
```

---

## Features

- 🌍 **5 locales out of the box** — `en`, `in`, `hi`, `de`, `fr`
- 🇮🇳 **Indian numbering system** — lakh, crore, arab, kharab, neel, padma, shankh
- 🔢 **BigInt support** — handles arbitrarily large numbers
- 💱 **Currency mode** — appends a currency label
- 🔌 **Extensible** — register your own locale in two lines
- 📦 **Three bundle formats** — ESM, CJS, UMD (browser ready)
- 🔷 **Full TypeScript types** included

---

## Installation

```bash
npm install @gks101@numtowords
```

---

## Quick Start

```ts
import { convert } from '@gks101@numtowords';

convert(0); // "Zero"
convert(42); // "Forty-two"
convert(1_000_000); // "One million"
```

### Indian numbering system

```ts
convert(1_00_000, { locale: 'in' }); // "One lakh"
convert(10_00_000, { locale: 'in' }); // "Ten lakh"
convert(1_00_00_000, { locale: 'in' }); // "One crore"
```

### Hindi (Devanagari)

```ts
convert(1_00_000, { locale: 'hi' }); // "एक लाख"
convert(1_00_00_000, { locale: 'hi' }); // "एक करोड़"
```

### German

```ts
convert(21, { locale: 'de' }); // "Einundzwanzig"
convert(1_000_000, { locale: 'de' }); // "Eine Million"
convert(2_000_000, { locale: 'de' }); // "Zwei Millionen"
```

### French

```ts
convert(70, { locale: 'fr' }); // "Soixante-dix"
convert(80, { locale: 'fr' }); // "Quatre-vingts"
convert(1_000_000, { locale: 'fr' }); // "Un million"
```

---

## API

### `convert(input, options?)`

| Parameter | Type                         | Description                                                                                                   |
| --------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `input`   | `number \| bigint \| string` | The number to convert. Negative numbers, string input with commas/underscores, and BigInts are all supported. |
| `options` | `ConvertOptions`             | Optional configuration (see below).                                                                           |

**Returns** `string`

### `ConvertOptions`

| Option       | Type                                   | Default | Description                                     |
| ------------ | -------------------------------------- | ------- | ----------------------------------------------- |
| `locale`     | `"en" \| "in" \| "hi" \| "de" \| "fr"` | `"en"`  | Target language / numeral system                |
| `capitalize` | `boolean`                              | `true`  | Capitalise the first letter                     |
| `useAnd`     | `boolean`                              | `true`  | Include "and" connector (English only)          |
| `currency`   | `string`                               | `""`    | Currency label appended to result, e.g. `"USD"` |

### Other exports

```ts
import {
  availableLocales,
  registerLocale,
  getLocale,
} from '@gks101@numtowords';

availableLocales(); // ["en", "in", "hi", "de", "fr"]
```

---

## Advanced Usage

### BigInt (very large numbers)

```ts
convert(9_007_199_254_740_993n); // beyond Number.MAX_SAFE_INTEGER
convert(1_00_00_00_00_000n, { locale: 'in' }); // "One arab"
```

### Disable capitalisation

```ts
convert(42, { capitalize: false }); // "forty-two"
```

### Disable "and" connector

```ts
convert(101, { useAnd: false }); // "One hundred one"
```

### Currency

```ts
convert(5, { currency: 'USD' }); // "Five USD"
convert(100000, { locale: 'in', currency: 'INR' }); // "One lakh INR"
```

### Negative numbers

```ts
convert(-1_500); // "Negative one thousand five hundred"
```

---

## Registering a Custom Locale

You can add locales at runtime by calling `registerLocale()` with a LocaleDefinition. The `convert` function receives a bigint and the resolved options — return a string (do not capitalise; the library handles optional capitalization).

Minimal stub:

```ts
import { registerLocale, convert } from '@gks101@numtowords';

registerLocale('es', {
  name: 'Spanish',
  convert(n, _opts) {
    // minimal implementation — handle zero and fall back to a placeholder
    if (n === 0n) return 'cero';
    return 'número';
  },
});

convert(5, { locale: 'es' }); // "Número" (capitalisation applied by library)
```

Practical Spanish examples

```ts
// Basic numbers
convert(0, { locale: 'es' }); // "Cero"
convert(1, { locale: 'es' }); // "Uno"
// Hundreds and thousands
convert(100, { locale: 'es' }); // "Cien"
convert(101, { locale: 'es' }); // "Ciento uno"

// Millions, accents and plurals
convert(1_000_000, { locale: 'es' }); // "Un millón"
convert(2_000_000, { locale: 'es' }); // "Dos millones"

// Negative and currency examples
convert(-5, { locale: 'es' }); // "Negativo cinco"
convert(1, { locale: 'es', currency: 'EUR' }); // "Uno EUR"
```

Notes

- Your locale's `convert` should accept `n: bigint` and return the words in lowercase (prefer returning canonical forms with proper accents); the main library applies capitalization when `capitalize: true`.
- Implementations may use BigInt arithmetic and should avoid throwing for valid numeric inputs.
- For full correctness in Spanish, handle special forms (e.g., "cien" vs "ciento"), accents (dieciséis, veintidós), and pluralisation ("millón" → "millones").

---

## Bundle Formats

| File                | Format    | Use case                         |
| ------------------- | --------- | -------------------------------- |
| `dist/index.esm.js` | ES Module | Bundlers (Vite, webpack, Rollup) |
| `dist/index.cjs.js` | CommonJS  | Node.js (`require`)              |
| `dist/index.umd.js` | UMD       | Browser `<script>` tags          |

### Browser via CDN

```html
<script src="dist/index.umd.js"></script>
<script>
  console.log(NumToWords.convert(1000000)); // "One million"
</script>
```

---

## Building from Source

```bash
npm install
npm run build   # Rollup → dist/
npm test        # Jest test suite
npm run lint    # TypeScript type check
```

---

## Indian Numeral Scale Reference

| Value                      | Indian Name | English equivalent  |
| -------------------------- | ----------- | ------------------- |
| 1,000                      | Thousand    | Thousand            |
| 1,00,000                   | Lakh        | Hundred Thousand    |
| 1,00,00,000                | Crore       | Ten Million         |
| 1,00,00,00,000             | Arab        | Billion             |
| 1,00,00,00,00,000          | Kharab      | Hundred Billion     |
| 1,00,00,00,00,00,000       | Neel        | Ten Trillion        |
| 1,00,00,00,00,00,00,000    | Padma       | Quadrillion         |
| 1,00,00,00,00,00,00,00,000 | Shankh      | Hundred Quadrillion |

---

## License

MIT
