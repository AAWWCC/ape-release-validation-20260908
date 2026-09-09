import assert from 'node:assert/strict';
import test from 'node:test';

test('isEven accepts primitive finite integers and rejects every invalid input class', async (t) => {
  const { isEven } = await import('../src/is-even-258-1.js');
  assert.equal(typeof isEven, 'function');

  const validCases = [
    ['zero', 0, true],
    ['negative zero', -0, true],
    ['positive even integer', 2, true],
    ['negative even integer', -2, true],
    ['larger positive even integer', 258, true],
    ['larger negative even integer', -258, true],
    ['positive odd integer', 1, false],
    ['negative odd integer', -1, false],
    ['larger positive odd integer', 259, false],
    ['larger negative odd integer', -259, false],
    ['largest safe positive integer', Number.MAX_SAFE_INTEGER, false],
    ['smallest safe negative integer', Number.MIN_SAFE_INTEGER, false],
    ['positive integer beyond safe range', 2 ** 53, true],
    ['negative integer beyond safe range', -(2 ** 53), true],
    ['largest finite positive integer', Number.MAX_VALUE, true],
    ['largest finite negative integer', -Number.MAX_VALUE, true],
  ];

  for (const [label, value, expected] of validCases) {
    await t.test(label, () => {
      assert.equal(isEven(value), expected);
    });
  }

  const invalidCases = [
    ['numeric string', '2'],
    ['empty string', ''],
    ['non-numeric string', 'even'],
    ['true boolean', true],
    ['false boolean', false],
    ['null', null],
    ['undefined', undefined],
    ['plain object', {}],
    ['boxed number', new Number(2)],
    ['empty array', []],
    ['numeric array', [2]],
    ['coercible object', { valueOf: () => 2 }],
    ['function', () => 2],
    ['symbol', Symbol('2')],
    ['even bigint', 2n],
    ['odd bigint', 1n],
    ['NaN', NaN],
    ['positive infinity', Infinity],
    ['negative infinity', -Infinity],
    ['positive fraction', 2.5],
    ['negative fraction', -2.5],
    ['small positive fraction', Number.MIN_VALUE],
    ['small negative fraction', -Number.MIN_VALUE],
  ];

  for (const [label, value] of invalidCases) {
    await t.test(`rejects ${label}`, () => {
      assert.throws(
        () => isEven(value),
        (error) => error instanceof TypeError && error.message === 'value must be a finite integer',
      );
    });
  }

  await t.test('rejects an omitted argument', () => {
    assert.throws(
      () => isEven(),
      (error) => error instanceof TypeError && error.message === 'value must be a finite integer',
    );
  });
});
