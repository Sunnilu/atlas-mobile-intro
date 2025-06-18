import * as React from 'react';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function TestSQLite() {
  useEffect(() => {
    const db = SQLite.openDatabaseSync('test.db');
    db.transaction((tx: { executeSql: (arg0: string) => void; }) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL);');
    });
  }, []);

  return (
    <View>
      <Text>SQLite should now be working</Text>
    </View>
  );
}
