export function isEven(value) {
  if (!Number.isInteger(value)) {
    throw new TypeError('value must be a finite integer');
  }

  return value % 2 === 0;
}
