// lib/db.ts
import * as SQLite from 'expo-sqlite';
import type { SQLTransaction, SQLError } from 'expo-sqlite';

const db = SQLite.openDatabase('activities.db');

export function initDatabase() {
  db.transaction(
    (tx: SQLTransaction) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          steps INTEGER NOT NULL,
          date INTEGER NOT NULL
        );`
      );
    },
    (error: SQLError) => {
      console.error('Database initialization error:', error);
    }
  );
}

export function getDb() {
  return db;
}
