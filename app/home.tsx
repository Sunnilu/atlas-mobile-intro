import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { getAllActivities, addActivity, deleteAllActivities, type Activity } from '@/lib/db';

export default function HomeScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const loadActivities = () => {
    getAllActivities((rows) => setActivities(rows));
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleAdd = () => {
    const steps = Math.floor(Math.random() * 10000);
    const date = Date.now();
    addActivity(steps, date, loadActivities);
  };

  const handleDeleteAll = () => {
    deleteAllActivities(loadActivities);
  };

  return (
    <View style={styles.container}>
      <Button title="Add Random Activity" onPress={handleAdd} />
      <Button title="Delete All" onPress={handleDeleteAll} color="red" />
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.activity}>
            <Text>Steps: {item.steps}</Text>
            <Text>Date: {new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No activities yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  activity: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
});
