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
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      const db = getDb();
      setError(null); // Clear any previous errors

      const activities: Activity[] = await db.withTransactionAsync(async (tx: Transaction) => {
        const result = await tx.executeSql(
          'SELECT * FROM activities ORDER BY date DESC;',
          []
        );
        return result.rows._array || [];
      });

      setActivities(activities);
    } catch (err) {
      console.error('Database error:', err);
      setError('Failed to fetch activities');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity List</Text>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
      <Button 
        title="Add Activity" 
        onPress={() => router.push('/add-activity')} 
      />
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
  error: { color: 'red', marginBottom: 16 }
});