const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const { setup, samplePayload } = require('./helpers');

let api;
before(() => {
  api = setup();
});

test('Purity: create, read and list', async () => {
  const body = await samplePayload(api, 'purities');
  const created = await api.post('/api/purities').send(body);
  assert.equal(created.status, 201, JSON.stringify(created.body));
  assert.ok(created.body.id);
  const fetched = await api.get(`/api/purities/${created.body.id}`);
  assert.equal(fetched.status, 200);
  const list = await api.get('/api/purities');
  assert.ok(list.body.total >= 1);
});

test('Purity: rejects a payload without required fields', async () => {
  const res = await api.post('/api/purities').send({});
  assert.equal(res.status, 400);
  assert.ok(res.body.details.includes('code is required'));
});

test('Purity: update and delete', async () => {
  const body = await samplePayload(api, 'purities');
  const { body: row } = await api.post('/api/purities').send(body);
  const updated = await api.put(`/api/purities/${row.id}`).send({ description: "Updated by test" });
  assert.equal(updated.status, 200, JSON.stringify(updated.body));
  assert.equal(updated.body.description, "Updated by test");
  const removed = await api.delete(`/api/purities/${row.id}`);
  assert.equal(removed.status, 200);
  const gone = await api.get(`/api/purities/${row.id}`);
  assert.equal(gone.status, 404);
});
