// lib/db.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('activities.db');

export function getDb() {
  return db;
}

export type Activity = {
  id: number;
  steps: number;
  date: number;
};

// ✅ Initialize the activities table
export function initDb(): void {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steps INTEGER NOT NULL,
        date INTEGER NOT NULL
      );`
    );
  });
}

// ✅ Insert a new activity
export function addActivity(
  steps: number,
  date: number,
  callback?: () => void
): void {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO activities (steps, date) VALUES (?, ?);',
      [steps, date],
      () => callback?.(),
      (_tx, error) => {
        console.error('Insert error:', error);
        return false;
      }
    );
  });
}

// ✅ Get all activities
export function getAllActivities(callback: (rows: Activity[]) => void): void {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM activities ORDER BY date DESC;',
      [],
      (_tx, result) => {
        callback(result.rows._array as Activity[]);
      },
      (_tx, error) => {
        console.error('Select error:', error);
        return false;
      }
    );
  });
}

// ✅ Delete all activities
export function deleteAllActivities(callback?: () => void): void {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM activities;',
      [],
      () => callback?.(),
      (_tx, error) => {
        console.error('Delete all error:', error);
        return false;
      }
    );
  });
}

// ✅ Delete an activity by ID
export function deleteActivityById(id: number, callback?: () => void): void {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM activities WHERE id = ?;',
      [id],
      () => callback?.(),
      (_tx, error) => {
        console.error('Delete by ID error:', error);
        return false;
      }
    );
  });
}
