// lib/db.ts
import * as SQLite from 'expo-sqlite';

let db: ReturnType<typeof SQLite.openDatabase> | null = null;

export function getDb() {
  if (!db) {
    db = SQLite.openDatabase('activities.db');
  }
  return db;
}

export function initDb() {
  const db = getDb();

  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steps INTEGER NOT NULL,
        date INTEGER NOT NULL
      );`,
      [],
      (_, result) => {
        console.log('✅ Table initialized. Rows affected:', result.rowsAffected);
      },
      (_, error) => {
        console.error('❌ Failed to initialize table:', error);
        return true;
      }
    );
  });
}
