import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('activities.db');

export function getDb() {
  return db;
}

export function initDb() {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steps INTEGER NOT NULL,
        date INTEGER NOT NULL
      );`
    );
  });
}
