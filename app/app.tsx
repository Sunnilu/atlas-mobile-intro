// database.ts
import { SQLite } from 'expo-sqlite';

// Enable promise support for SQLite
SQLite.enablePromise(true);

// Database configuration
const DB_NAME = 'activities.db';

// Type definitions
type Activity = {
  id: number;
  steps: number;
  date: number;
};

// Initialize database
export const initDatabase = async (): Promise<void> => {
  try {
    const db = await SQLite.openDatabase(DB_NAME);
    await db.transaction(tx => {
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

// Database operations
export const addActivity = async (steps: number, date: number): Promise<void> => {
  try {
    const db = await SQLite.openDatabase(DB_NAME);
    await db.transaction(tx => {
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
    const [result] = await db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM activities ORDER BY date DESC',
        []
      );
    });
    return result.rows._array;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};