import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('the isolated synthetic project has a private package and no dependencies', () => {
  const project = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(project.name, 'ape-release-validation-synthetic');
  assert.equal(project.private, true);
  assert.equal(project.type, 'module');
  assert.equal(Object.keys(project.dependencies ?? {}).length, 0);
});
