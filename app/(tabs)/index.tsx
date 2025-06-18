import React, { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getDb } from '@/lib/db';
import { FlashList } from '@shopify/flash-list';

type Activity = {
  id: number;
  steps: number;
  date: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = () => {
    const db = getDb();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM activities ORDER BY date DESC;',
        [],
        (_, { rows }) => setActivities(rows._array || []),
        (_, err) => {
          console.error('Failed to fetch:', err);
          setError('Failed to load activities');
          return true;
        }
      );
    });
  };

  const deleteAllActivities = () => {
    const db = getDb();
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM activities;',
        [],
        () => {
          console.log('✅ All activities deleted');
          fetchActivities(); // Refresh the list
        },
        (_, err) => {
          console.error('❌ Failed to delete activities:', err);
          Alert.alert('Error', 'Could not delete all activities.');
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
      <Text style={styles.title}>Activity List</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="Add Activity" onPress={() => router.push('/add-activity')} />

      {/* ✅ New Button Below */}
      <View style={{ marginVertical: 10 }}>
        <Button title="Delete All Activities" color="red" onPress={deleteAllActivities} />
      </View>

      <FlashList
        data={activities}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            Steps: {item.steps} | {new Date(item.date * 1000).toLocaleString()}
          </Text>
        )}
        keyExtractor={item => item.id.toString()}
        estimatedItemSize={40}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  item: { marginBottom: 12, fontSize: 16 },
  error: { color: 'red', marginBottom: 16 },
});
