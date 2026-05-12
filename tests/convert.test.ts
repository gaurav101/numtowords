import { convert, availableLocales } from '../src';

// ─── English ──────────────────────────────────────────────────────────────────
describe('English (en)', () => {
  it('converts zero', () => expect(convert(0)).toBe('Zero'));
  it('converts single digit', () => expect(convert(5)).toBe('Five'));
  it('converts teens', () => expect(convert(13)).toBe('Thirteen'));
  it('converts tens', () => expect(convert(40)).toBe('Forty'));
  it('converts 99', () => expect(convert(99)).toBe('Ninety-nine'));
  it('converts hundreds', () => expect(convert(100)).toBe('One hundred'));
  it('converts 999', () =>
    expect(convert(999)).toBe('Nine hundred and ninety-nine'));
  it('converts thousands', () => expect(convert(1000)).toBe('One thousand'));
  it('converts 1,000,124', () =>
    expect(convert(1_000_124)).toBe('One million one hundred and twenty-four'));
  it('converts one million', () =>
    expect(convert(1_000_000)).toBe('One million'));
  it('converts 1 billion', () =>
    expect(convert(1_000_000_000)).toBe('One billion'));
  it('handles negative', () => expect(convert(-42)).toBe('Negative forty-two'));
  it('accepts string input', () => expect(convert('500')).toBe('Five hundred'));
  it('accepts bigint input', () =>
    expect(convert(9007199254740993n)).toContain('quadrillion'));
  it("disables 'and'", () =>
    expect(convert(101, { useAnd: false })).toBe('One hundred one'));
});

// ─── Indian ───────────────────────────────────────────────────────────────────
describe('Indian system (in)', () => {
  it('converts zero', () => expect(convert(0, { locale: 'in' })).toBe('Zero'));
  it('1,00,000 = one lakh', () =>
    expect(convert(100_000, { locale: 'in' })).toBe('One lakh'));
  it('10,00,000 = ten lakh', () =>
    expect(convert(1_000_000, { locale: 'in' })).toBe('Ten lakh'));
  it('1,000,124 = ten lakh one hundred twenty-four', () =>
    expect(convert(1_000_124, { locale: 'in' })).toBe(
      'Ten lakh one hundred twenty-four',
    ));
  it('1,00,00,000 = one crore', () =>
    expect(convert(10_000_000, { locale: 'in' })).toBe('One crore'));
  it('1,50,00,000 = one crore fifty lakh', () =>
    expect(convert(15_000_000, { locale: 'in' })).toBe('One crore fifty lakh'));
  it('100 crore = one arab', () =>
    expect(convert(1_000_000_324n, { locale: 'in' })).toBe(
      'One arab three hundred twenty-four',
    ));
});

// ─── Hindi ────────────────────────────────────────────────────────────────────
describe('Hindi (hi)', () => {
  it('converts zero', () => expect(convert(0, { locale: 'hi' })).toBe('शून्य'));
  it('converts 1 lakh', () =>
    expect(convert(100_000, { locale: 'hi' })).toBe('एक लाख'));
  it('converts 1 crore', () =>
    expect(convert(10_000_000, { locale: 'hi' })).toBe('एक करोड़'));
  it('converts 1,000,124', () =>
    expect(convert(1_000_124, { locale: 'hi' })).toBe('दस लाख एक सौ चौबीस'));
  it('converts 1,000,324', () =>
    expect(convert(1_000_324, { locale: 'hi' })).toBe('दस लाख तीन सौ चौबीस'));
});

// ─── German ───────────────────────────────────────────────────────────────────
describe('German (de)', () => {
  it('converts zero', () => expect(convert(0, { locale: 'de' })).toBe('null'));
  it('converts 21', () =>
    expect(convert(21, { locale: 'de' })).toBe('Einundzwanzig'));
  it('converts 1000', () =>
    expect(convert(1000, { locale: 'de' })).toBe('Eintausend'));
  it('converts one million', () =>
    expect(convert(1_000_000, { locale: 'de' })).toBe('Eine Million'));
  it('converts two million', () =>
    expect(convert(2_000_000, { locale: 'de' })).toBe('Zwei Millionen'));
});

// ─── French ───────────────────────────────────────────────────────────────────
describe('French (fr)', () => {
  it('converts zero', () => expect(convert(0, { locale: 'fr' })).toBe('Zéro'));
  it('converts 70', () =>
    expect(convert(70, { locale: 'fr' })).toBe('Soixante-dix'));
  it('converts 80', () =>
    expect(convert(80, { locale: 'fr' })).toBe('Quatre-vingts'));
  it('converts 99', () =>
    expect(convert(99, { locale: 'fr' })).toBe('Quatre-vingt-dix-neuf'));
  it('converts 1000', () =>
    expect(convert(1000, { locale: 'fr' })).toBe('Mille'));
  it('converts two million', () =>
    expect(convert(2_000_000, { locale: 'fr' })).toBe('Deux millions'));
});

// ─── Currency ─────────────────────────────────────────────────────────────────
describe('Currency option', () => {
  it('appends currency to English', () =>
    expect(convert(5, { currency: 'USD' })).toBe('Five USD'));
  it('appends currency to Indian', () =>
    expect(convert(100_000, { locale: 'in', currency: 'INR' })).toBe(
      'One lakh INR',
    ));
});

// ─── availableLocales ─────────────────────────────────────────────────────────
describe('availableLocales()', () => {
  it('returns all registered locales', () => {
    const locales = availableLocales();
    expect(locales).toContain('en');
    expect(locales).toContain('in');
    expect(locales).toContain('hi');
    expect(locales).toContain('de');
    expect(locales).toContain('fr');
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────
describe('Error handling', () => {
  it('throws on invalid input', () =>
    expect(() => convert('abc' as never)).toThrow());
  it('throws on unknown locale', () =>
    expect(() => convert(1, { locale: 'xx' as never })).toThrow());
});
