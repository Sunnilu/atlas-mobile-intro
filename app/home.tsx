// app/home.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { getDb } from '@/lib/db';

export default function HomeScreen() {
  useEffect(() => {
    const db = getDb();
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM activities', [], (_, { rows }) => {
        console.log(rows._array);
      });
    });
  }, []);

  return (
    <View style={{ padding: 24 }}>
      <Text>Check your console for activity logs</Text>
    </View>
  );
}
