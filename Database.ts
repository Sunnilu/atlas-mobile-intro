// database.ts
import SQLite from 'expo-sqlite';

SQLite.enablePromise(true);

const DB_NAME = 'activities.db';

type Activity = {
  id: number;
  steps: number;
  date: number;
};

export const initDatabase = async (): Promise<void> => {
  try {
    const db = await SQLite.openDatabase(DB_NAME);
    await db.transaction((tx: SQLite.SQLTransaction) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          steps INTEGER NOT NULL,
          date INTEGER NOT NULL
        );
      `);
    });
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const addActivity = async (steps: number, date: number): Promise<void> => {
  try {
    const db = await SQLite.openDatabase(DB_NAME);
    await db.transaction((tx: SQLite.SQLTransaction) => {
      tx.executeSql(
        'INSERT INTO activities (steps, date) VALUES (?, ?)',
        [steps, date]
      );
    });
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

export const getActivities = async (): Promise<Activity[]> => {
  try {
    const db = await SQLite.openDatabase(DB_NAME);
    return await new Promise<Activity[]>((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(
            'SELECT * FROM activities ORDER BY date DESC',
            [],
            (_, result) => resolve(result.rows._array as Activity[]),
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          reject(error);
        }
      );
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};