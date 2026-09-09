import assert from 'node:assert/strict';
import test from 'node:test';

test('normalizeLabel implements the primitive-string normalization contract', async (t) => {
  const { normalizeLabel } = await import('../src/normalize-label-258-1.js');
  assert.equal(typeof normalizeLabel, 'function');

  const cases = [
    ['unchanged lowercase text', 'already lowercase', 'already lowercase'],
    ['mixed case', 'MiXeD CaSe', 'mixed case'],
    ['surrounding whitespace', '  Label  ', 'label'],
    ['internal spaces', 'One   Two    Three', 'one two three'],
    ['tabs', '\tOne\t\tTwo\t', 'one two'],
    ['newlines', '\nOne\n\nTwo\r\nThree\r\n', 'one two three'],
    ['non-breaking spaces', '\u00a0One\u00a0\u00a0Two\u00a0', 'one two'],
    ['combined whitespace runs', ' \t\nOne \t\u00a0\r\nTwo\u3000 ', 'one two'],
    ['standard Unicode lowercase', '\u0130 CAFÉ', 'i\u0307 café'],
    ['preserves zero-width spaces', '\u200bA\u200bB\u200b', '\u200ba\u200bb\u200b'],
    ['zero-width space is non-whitespace', '\u200b', '\u200b'],
  ];

  for (const [label, input, expected] of cases) {
    await t.test(label, () => assert.equal(normalizeLabel(input), expected));
  }

  const whitespace = [
    ['TAB', '\t'], ['LF', '\n'], ['VT', '\v'], ['FF', '\f'], ['CR', '\r'],
    ['SPACE', ' '], ['NBSP', '\u00a0'], ['U+1680', '\u1680'],
    ['U+2000', '\u2000'], ['U+2001', '\u2001'], ['U+2002', '\u2002'],
    ['U+2003', '\u2003'], ['U+2004', '\u2004'], ['U+2005', '\u2005'],
    ['U+2006', '\u2006'], ['U+2007', '\u2007'], ['U+2008', '\u2008'],
    ['U+2009', '\u2009'], ['U+200A', '\u200a'], ['U+2028', '\u2028'],
    ['U+2029', '\u2029'], ['U+202F', '\u202f'], ['U+205F', '\u205f'],
    ['U+3000', '\u3000'], ['U+FEFF', '\ufeff'],
  ];

  const assertEmptyError = (input) => assert.throws(
    () => normalizeLabel(input),
    { name: 'RangeError', message: 'value must contain non-whitespace characters', constructor: RangeError },
  );

  await t.test('rejects empty input', () => assertEmptyError(''));
  await t.test('rejects mixed whitespace-only input', () => assertEmptyError(' \t\r\n\u00a0\u3000\ufeff'));

  for (const [label, char] of whitespace) {
    await t.test(`trims and collapses ${label}`, () => {
      assert.equal(normalizeLabel(`${char}${char}ONE${char}${char}TWO${char}${char}`), 'one two');
    });
    await t.test(`rejects ${label}-only input`, () => assertEmptyError(char + char));
  }

  let coercions = 0;
  const throwingCoercion = {
    [Symbol.toPrimitive]() {
      coercions += 1;
      throw new Error('coercion must not occur');
    },
  };
  const invalidCases = [
    ['undefined', undefined], ['null', null], ['true', true], ['false', false],
    ['zero', 0], ['number', 12.5], ['NaN', NaN], ['infinity', Infinity],
    ['bigint', 1n], ['symbol', Symbol('label')], ['array', []],
    ['string array', ['label']], ['plain object', {}], ['function', () => 'label'],
    ['boxed string', new String('label')],
    ['coercible object', { toString: () => 'label' }],
    ['throwing coercion object', throwingCoercion],
  ];
  const typeError = { name: 'TypeError', message: 'value must be a string', constructor: TypeError };
  for (const [label, input] of invalidCases) {
    await t.test(`rejects ${label}`, () => assert.throws(() => normalizeLabel(input), typeError));
  }
  await t.test('rejects omitted input', () => assert.throws(() => normalizeLabel(), typeError));
  await t.test('does not coerce objects', () => assert.equal(coercions, 0));
});
