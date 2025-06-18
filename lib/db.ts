import { Transaction } from '@/types';
import { 
  openDatabaseSync, 
  SQLiteDatabase 
} from 'expo-sqlite';


let db: SQLiteDatabase | null = null;

export function getDb(): SQLiteDatabase {
  if (!db) {
    db = openDatabaseSync('activities.db');
  }
  return db!;
}

export async function initDb() {
  const db = getDb();
  
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steps INTEGER NOT NULL,
        date INTEGER NOT NULL
      );
    `);
  });
}