import React, { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getDb } from '@/lib/db';

// ✅ Activity type for local use
type Activity = {
  id: number;
  steps: number;
  date: number;
};

// ✅ SQLite response types (safely typed inline)
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
      <Text style={styles.title}>Activity List</Text>
      <Button title="Add Activity" onPress={() => router.push('/add-activity')} />
      <View style={styles.listContainer}>
        {activities.length === 0 ? (
          <Text style={styles.noData}>No activities yet</Text>
        ) : (
          activities.map(activity => (
            <Text key={activity.id} style={styles.item}>
              Steps: {activity.steps} | Date: {new Date(activity.date * 1000).toLocaleString()}
            </Text>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  listContainer: { marginTop: 20 },
  item: { marginBottom: 12, fontSize: 16 },
  noData: { fontStyle: 'italic', color: '#888' },
});
