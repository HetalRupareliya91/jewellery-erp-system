const { test } = require('node:test');
const assert = require('node:assert/strict');
const { round2, round3, sum } = require('../src/lib/money');
const { financialYear, monthRange, isIsoDate } = require('../src/lib/dates');

test('round2 / round3 avoid floating point drift', () => {
  assert.equal(round2(1.005), 1.01);
  assert.equal(round2(0.1 + 0.2), 0.3);
  assert.equal(round3(5.2499999), 5.25);
  assert.equal(sum([{ a: 1.5 }, { a: '2.5' }, {}], 'a'), 4);
});

test('financial year runs April to March', () => {
  assert.equal(financialYear('2026-04-01'), '26-27');
  assert.equal(financialYear('2027-03-31'), '26-27');
  assert.equal(financialYear('2026-03-31'), '25-26');
});

test('month range handles month lengths and leap years', () => {
  assert.deepEqual(monthRange('2026-02'), { from: '2026-02-01', to: '2026-02-28' });
  assert.deepEqual(monthRange('2028-02'), { from: '2028-02-01', to: '2028-02-29' });
  assert.equal(monthRange('2026-2'), null);
  assert.ok(isIsoDate('2026-10-14'));
  assert.ok(!isIsoDate('14/10/2026'));
});
