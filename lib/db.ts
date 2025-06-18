// lib/db.ts
import * as SQLite from 'expo-sqlite';
import type { SQLTransaction, ResultSet } from '@/types/sqlite'; // ✅ assuming you made this

let db: ReturnType<typeof SQLite.openDatabase> | null = null;

export function getDb() {
  if (!db) {
    db = SQLite.openDatabase('activities.db');
  }
  return db;
}

export function initDb() {
  const db = getDb();

  db.transaction((tx: SQLTransaction) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steps INTEGER NOT NULL,
        date INTEGER NOT NULL
      );`,
      [],
      (_tx: SQLTransaction, result: ResultSet) => {
        console.log('✅ Table initialized, rows affected:', result.rowsAffected);
      },
      (_tx: SQLTransaction, error: any) => {
        console.error('❌ Failed to initialize table:', error);
        return true;
      }
    );
  });
}
