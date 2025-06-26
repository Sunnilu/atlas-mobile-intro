// database.ts
import * as SQLite from 'expo-sqlite/next';

export async function setupDatabase() {
  const db = await SQLite.openDatabaseAsync('databaseName');

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

  const result = await db.runAsync(
    'INSERT INTO test (value, intValue) VALUES (?, ?)',
    'aaa',
    100
  );
  console.log('Inserted:', result.lastInsertRowId, result.changes);

  await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']);
  await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' });

  const firstRowRaw = await db.getFirstAsync('SELECT * FROM test');
  const firstRow = firstRowRaw as { id: number; value: string; intValue: number };
  console.log('First row:', firstRow.id, firstRow.value, firstRow.intValue);

  const allRowsRaw = await db.getAllAsync('SELECT * FROM test');
  const allRows = allRowsRaw as { id: number; value: string; intValue: number }[];
  console.log('All rows:');
  allRows.forEach(row => console.log(row.id, row.value, row.intValue));

  const countRowRaw = await db.getFirstAsync('SELECT COUNT(*) AS count FROM test');
  const countRow = countRowRaw as { count: number };
  console.log(`Row count before getEachAsync: ${countRow.count}`);

  console.log('Streaming rows:');
  try {
    const stream = db.getEachAsync('SELECT * FROM test');
    for await (const rowRaw of stream) {
      const row = rowRaw as { id: number; value: string; intValue: number };
      console.log(row.id, row.value, row.intValue);
    }
  } catch (err) {
    console.error('Error iterating rows:', err);
  }

  return db;
}
