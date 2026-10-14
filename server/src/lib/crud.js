const { getDb } = require('../db');
const { validate } = require('./validate');
const { notFound } = require('./errors');

/*
 * Generic repository/service for a table described by a schema.
 * hooks:
 *   beforeSave(data, existing) -> data   compute derived fields / extra checks
 *   afterCreate(row)                     side effects (runs in the same transaction)
 *   afterUpdate(row, existing)
 */
function crud(schema, hooks = {}) {
  const { table, fields, search = [] } = schema;
  const columns = Object.keys(fields);

  function get(id) {
    const row = getDb().prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
    if (!row) throw notFound(`${schema.label || table} ${id} not found`);
    return row;
  }

  function list(query = {}) {
    const where = [];
    const params = [];
    for (const col of columns) {
      if (query[col] !== undefined && query[col] !== '') {
        where.push(`${col} = ?`);
        params.push(query[col]);
      }
    }
    if (query.q && search.length) {
      where.push(`(${search.map((c) => `${c} LIKE ?`).join(' OR ')})`);
      search.forEach(() => params.push(`%${query.q}%`));
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const limit = Math.min(Number(query.limit) || 100, 500);
    const offset = Number(query.offset) || 0;
    const db = getDb();
    const total = db.prepare(`SELECT COUNT(*) AS n FROM ${table} ${clause}`).get(...params).n;
    const data = db
      .prepare(`SELECT * FROM ${table} ${clause} ORDER BY id DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    return { data, total, limit, offset };
  }

  function insert(data) {
    const keys = Object.keys(data);
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;
    const info = getDb().prepare(sql).run(...keys.map((k) => data[k]));
    return get(info.lastInsertRowid);
  }

  function create(input) {
    return getDb().transaction(() => {
      let data = validate(schema, input);
      if (hooks.beforeSave) data = hooks.beforeSave(data, null, input);
      const row = insert(data);
      if (hooks.afterCreate) hooks.afterCreate(row, input);
      return get(row.id);
    })();
  }

  function update(id, input) {
    return getDb().transaction(() => {
      const existing = get(id);
      let data = validate(schema, { ...existing, ...input });
      if (hooks.beforeSave) data = hooks.beforeSave(data, existing, input);
      const keys = Object.keys(data);
      getDb()
        .prepare(`UPDATE ${table} SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`)
        .run(...keys.map((k) => data[k]), id);
      const row = get(id);
      if (hooks.afterUpdate) hooks.afterUpdate(row, existing);
      return row;
    })();
  }

  function patch(id, data) {
    const keys = Object.keys(data);
    getDb()
      .prepare(`UPDATE ${table} SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`)
      .run(...keys.map((k) => data[k]), id);
    return get(id);
  }

  function remove(id) {
    get(id);
    getDb().prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    return { deleted: true, id: Number(id) };
  }

  return { schema, table, get, list, insert, create, update, patch, remove };
}

module.exports = { crud };
