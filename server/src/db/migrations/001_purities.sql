-- Purities
CREATE TABLE purities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  metal TEXT DEFAULT 'gold' CHECK (metal IN ('gold', 'silver', 'platinum')),
  karat REAL,
  fineness REAL NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
