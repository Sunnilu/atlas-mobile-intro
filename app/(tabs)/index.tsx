// Updated HomeScreen UI with design specs (fixed typings)
import React, { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getDb } from '@/lib/db';
import { FlashList } from '@shopify/flash-list';
import type { SQLTransaction, ResultSet } from '@/types/sqlite';

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
    try {
      const db = getDb();
      db.transaction((tx: SQLTransaction) => {
        tx.executeSql(
          'SELECT * FROM activities ORDER BY date DESC;',
          [],
          (_tx: SQLTransaction, result: ResultSet) => {
            const items: Activity[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              items.push(result.rows.item(i));
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
    } catch (e) {
      console.error('❌ SQLite not available:', e);
      setError('Database not available on this platform.');
    }
  };

  const deleteAllActivities = () => {
    const db = getDb();
    db.transaction((tx: SQLTransaction) => {
      tx.executeSql(
        'DELETE FROM activities;',
        [],
        () => {
          console.log('🧹 All activities deleted');
          fetchActivities();
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Activity List</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlashList
        data={activities}
        renderItem={({ item }) => (
          <View style={styles.activityBlock}>
            <Text style={styles.activityText}>
              Steps: {item.steps} | {new Date(item.date * 1000).toLocaleString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={27}
        contentContainerStyle={styles.list}
      />

      <View style={styles.buttonRow}>
        <Button title="Add Activity" color="#1ED2AF" onPress={() => router.push('/add-activity')} />
      </View>
      <View style={styles.buttonRow}>
        <Button title="Delete All Activities" color="#D00414" onPress={deleteAllActivities} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FEF9E6',
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 10,
    color: '#000000',
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  activityBlock: {
    width: 133,
    height: 27,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  activityText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 10,
    color: '#000000',
  },
  buttonRow: {
    width: 142,
    height: 7,
    marginTop: 10,
  },
});
