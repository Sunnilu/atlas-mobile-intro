import { 
  openDatabase, 
  SQLiteDatabase 
} from 'expo-sqlite';

interface Transaction {
  executeSql(sqlQuery: string, args?: any[]): Promise<{ rows: { _array?: any[] } }>;
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