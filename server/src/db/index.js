const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('../config');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
let db;

function migrate(database) {
  database.exec(`CREATE TABLE IF NOT EXISTS _migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  const applied = new Set(database.prepare('SELECT name FROM _migrations').all().map((r) => r.name));
  const files = fs.existsSync(MIGRATIONS_DIR)
    ? fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort()
    : [];
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    database.transaction(() => {
      database.exec(sql);
      database.prepare('INSERT INTO _migrations (name) VALUES (?)').run(file);
    })();
  }
}

function open(file = config.dbFile) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  migrate(db);
  return db;
}

function getDb() {
  if (!db) open();
  return db;
}

function close() {
  if (db) db.close();
  db = undefined;
}

module.exports = { open, getDb, close, migrate };
