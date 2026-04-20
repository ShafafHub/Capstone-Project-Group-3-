import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// --- DB connection ---
export const dbPromise = open({
  filename: './db.sqlite',
  driver: sqlite3.Database,
});