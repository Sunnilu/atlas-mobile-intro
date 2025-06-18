import React, { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getDb } from '@/lib/db';
import { FlashList } from '@shopify/flash-list';
import type { SQLTransaction, ResultSet } from '@/types/sqlite'; // 👈 Import the correct types

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
    db.transaction((tx: SQLTransaction) => {
      tx.executeSql(
        'SELECT * FROM activities ORDER BY date DESC;',
        [],
        (_tx: SQLTransaction, result: ResultSet) => {
          const rows = result.rows;
          const items: Activity[] = [];
          for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i));
          }
          setActivities(items);
        },
        (_tx: SQLTransaction, err: any) => {
          console.error('❌ Error fetching activities:', err);
          setError('Failed to load activities');
          return true;
        }
      );
    });
  };

  const deleteAllActivities = () => {
    const db = getDb();
    db.transaction((tx: SQLTransaction) => {
      tx.executeSql(
        'DELETE FROM activities;',
        [],
        () => {
          console.log('✅ All activities deleted');
          fetchActivities(); // Refresh list
        },
        (_tx: SQLTransaction, err: any) => {
          console.error('❌ Failed to delete all activities:', err);
          Alert.alert('Error', 'Could not delete all activities.');
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
      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="Add Activity" onPress={() => router.push('/add-activity')} />

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
