export function normalizeLabel(value) {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new RangeError('value must contain non-whitespace characters');
  }

  return trimmed.replace(/\s+/g, ' ').toLowerCase();
}
