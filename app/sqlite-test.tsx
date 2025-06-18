// app/test-sqlite.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function TestSQLite() {
  useEffect(() => {
    const db = SQLite.openDatabase('test.db');

    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL);',
        [],
        () => console.log('✅ Table created successfully'),
        (_, error) => {
          console.error('❌ Table creation failed:', error);
          return true;
        }
      );
    });
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>SQLite should now be working</Text>
    </View>
  );
}
