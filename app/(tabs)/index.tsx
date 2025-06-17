import React, { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getDb } from '@/lib/db';

// 👇 Local fallback types since expo-sqlite doesn't export these properly
type Activity = {
  id: number;
  steps: number;
  date: number;
};

type SQLResultSet = {
  rows: {
    _array: Activity[];
    length: number;
    item: (index: number) => Activity;
  };
};

type SQLTransaction = {
  executeSql: (
    sqlStatement: string,
    args?: unknown[],
    successCallback?: (tx: SQLTransaction, resultSet: SQLResultSet) => void,
    errorCallback?: (tx: SQLTransaction, error: unknown) => boolean
  ) => void;
};

export default function HomeScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = () => {
    const db = getDb();
    db.transaction((tx: SQLTransaction) => {
      tx.executeSql(
        'SELECT * FROM activities ORDER BY date DESC;',
        [],
        (_tx, result) => {
          setActivities(result.rows._array);
        },
        (_tx, error) => {
          console.error('Failed to fetch activities:', error);
          return true;
        }
      );
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities</Text>
      <Button title="Add Activity" onPress={() => router.push('/add-activity')} />
      {activities.map(activity => (
        <Text key={activity.id}>
          Steps: {activity.steps} | Date: {new Date(activity.date * 1000).toLocaleString()}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
