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
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM activities ORDER BY date DESC;',
        [],
        (_, { rows }) => {
          setActivities(rows._array as Activity[]);
        },
        (_, error) => {
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
