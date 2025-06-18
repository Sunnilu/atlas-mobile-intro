// lib/db.ts
import { openDatabase } from 'expo-sqlite/next';

const db = openDatabase('activities.db');

export function getDb() {
  return db;
}

export async function initDb() {
  await db.withTransactionAsync(async (tx) => {
    await tx.executeSqlAsync(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steps INTEGER NOT NULL,
        date INTEGER NOT NULL
      );
    `);
  });
}
export async function clearDb() {
  await db.withTransactionAsync(async (tx) => {
    await tx.executeSqlAsync('DROP TABLE IF EXISTS activities;');
    await initDb();
  });
}