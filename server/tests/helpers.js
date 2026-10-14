process.env.DB_FILE = ':memory:';

const path = require('path');
const request = require('supertest');
const db = require('../src/db');
const { createApp } = require('../src/app');

let counter = 0;

// Fresh in-memory database and app for each test file
function setup() {
  db.close();
  db.open(':memory:');
  return request(createApp());
}

const loadSchema = (table) => require(path.join(__dirname, '..', 'src', 'modules', table, 'schema.js'));

/*
 * Builds a valid payload from a module's `sample`, creating any required
 * parent records (purity, karigar, customer, ...) through the API first.
 */
async function samplePayload(api, table, overrides = {}) {
  const schema = loadSchema(table);
  const body = { ...schema.sample };
  counter += 1;
  for (const [name, def] of Object.entries(schema.fields)) {
    if (def.unique && typeof body[name] === 'string') body[name] = `${body[name]}-${counter}`;
    if (def.type === 'ref' && def.required && overrides[name] === undefined) {
      const parent = await createRecord(api, def.ref);
      body[name] = parent.id;
    }
  }
  return { ...body, ...overrides };
}

async function createRecord(api, table, overrides = {}) {
  const body = await samplePayload(api, table, overrides);
  const res = await api.post(`/api/${table}`).send(body);
  if (res.status !== 201) {
    throw new Error(`Could not create ${table}: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body;
}

module.exports = { setup, samplePayload, createRecord, loadSchema };
