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

export default function HomeScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = async () => {
    const db = getDb();
    
    await db.withTransactionAsync(async () => {
      const resultSet: any = await db.execAsync(
        'SELECT * FROM activities ORDER BY date DESC;'
      );

      // resultSet is an array of result objects, take the first result's rows
      setActivities(resultSet && resultSet[0]?.rows ? resultSet[0].rows : []);
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
});