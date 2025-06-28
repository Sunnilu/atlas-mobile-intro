// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Pressable } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import {
  getAllActivities,
  addActivity,
  deleteAllActivities,
  deleteActivityById,
  type Activity,
} from '@/lib/db';
import { router } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit app/index.tsx to edit screen.</Text>
      
      <Pressable onPress={() => router.push('/add-activity')}>
        <Text style={styles.buttonText}>Click Me</Text>
      </Pressable>

      <HomeScreen />
    </View>
  );
}

function HomeScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const loadActivities = () => {
    getAllActivities(setActivities);
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
    Alert.alert('Confirm', 'Delete all activities?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAllActivities(loadActivities) },
    ]);
  };

  const handleDeleteOne = (id: number) => {
    deleteActivityById(id, loadActivities);
  };

  return (
    <View style={styles.container}>
      <Button title="Add Random Activity" onPress={handleAdd} />
      <Button title="Delete All" color="red" onPress={handleDeleteAll} />

      <SwipeListView
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.activity}>
            <Text>Steps: {item.steps}</Text>
            <Text>Date: {new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.hiddenRow}>
            <Button
              title="Delete"
              color="white"
              onPress={() => handleDeleteOne(item.id)}
            />
          </View>
        )}
        rightOpenValue={-75}
        disableRightSwipe
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonText: {
    color: '#1ED2AF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 16,
  },
  activity: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  hiddenRow: {
    backgroundColor: 'red',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 16,
    height: '100%',
    borderRadius: 8,
  },
});
