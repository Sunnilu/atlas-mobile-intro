// database.ts
import * as SQLite from 'expo-sqlite/next';

export async function setupDatabase() {
  const db = await SQLite.openDatabaseAsync('databaseName');

  // Run schema + seed
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      intValue INTEGER
    );
    INSERT INTO test (value, intValue) VALUES ('test1', 123);
    INSERT INTO test (value, intValue) VALUES ('test2', 456);
    INSERT INTO test (value, intValue) VALUES ('test3', 789);
  `);

  // Insert
  const result = await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', 'aaa', 100);
  console.log('Inserted:', result.lastInsertRowId, result.changes);

  // Update
  await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']);

  // Delete
  await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' });

  // Get one
  const firstRow = await db.getFirstAsync('SELECT * FROM test');
  console.log('First row:', firstRow);

  // Get all
  const allRows = await db.getAllAsync('SELECT * FROM test');
  console.log('All rows:');
  allRows.forEach(row => console.log(row));

  // Cursor
  console.log('Streaming rows:');
  for await (const row of db.getEachAsync('SELECT * FROM test')) {
    console.log(row);
  }

  return db;
}
