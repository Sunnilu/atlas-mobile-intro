import React, { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getDb } from '@/lib/db';

type Activity = {
  id: number;
  steps: number;
  date: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = () => {
    const db = getDb();
    interface Tx {
      executeSql: (
      sqlStatement: string,
      args?: any[],
      successCallback?: (tx: Tx, resultSet: ResultSet) => void,
      errorCallback?: (tx: Tx, error: any) => boolean
      ) => void;
    }

    interface ResultSet {
      rows: {
      _array: Activity[];
      };
    }

    db.transaction((tx: Tx) => {
      tx.executeSql(
      'SELECT * FROM activities ORDER BY date DESC;',
      [],
      (_: Tx, { rows }: ResultSet) => {
        setActivities(rows._array as Activity[]);
      },
      (_: Tx, error: any) => {
        console.error('Failed to fetch activities:', error);
        return true;
      }
      );
    });
  };

  useFocusEffect(useCallback(() => {
    fetchActivities();
  }, []));

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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});
