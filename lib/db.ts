import { openDatabase } from 'expo-sqlite';

interface Activity {
  id?: number;
  steps: number;
  date: number;
}

interface ResultSet {
  rows: {
    _array?: Activity[];
  };
}

interface Transaction {
  executeSql(
    sqlQuery: string,
    args?: any[]
  ): Promise<ResultSet>;
}

interface Database {
  withTransactionAsync<T>(callback: (tx: Transaction) => Promise<T>): Promise<T>;
}

declare global {
  namespace ExpoSQLite {
    interface SQLiteDatabase extends Database {}
  }
}

let db: ExpoSQLite.SQLiteDatabase | null = null;

export function getDb(): ExpoSQLite.SQLiteDatabase {
  if (!db) {
    db = openDatabase('activities.db') as ExpoSQLite.SQLiteDatabase;
  }
  return db!;
}

export async function initDb() {
  const db = getDb();
  
  await db.withTransactionAsync(async (tx: Transaction) => {
    await tx.executeSql(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steps INTEGER NOT NULL,
        date INTEGER NOT NULL
      );
    `);
  });
}

// 🆕 Delete all activities
export async function deleteAllActivities() {
  const db = getDb();
  await db.withTransactionAsync(async (tx: Transaction) => {
    await tx.executeSql('DELETE FROM activities;');
  });
}

// 🆕 Delete one activity by ID
export async function deleteActivityById(id: number) {
  const db = getDb();
  await db.withTransactionAsync(async (tx: Transaction) => {
    await tx.executeSql('DELETE FROM activities WHERE id = ?;', [id]);
  });
}
