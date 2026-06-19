import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, '..', 'game.db'));

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
