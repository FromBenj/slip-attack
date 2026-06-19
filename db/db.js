import Database from 'better-sqlite3';

const db = new Database('./game.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS players
  (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT UNIQUE,
    avatar  TEXT,
    score INTEGER
  )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        title      TEXT,
        answer     TEXT,
        difficulty INTEGER
    )
`);



export default db;
