import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getDb } from '@/lib/db';
import type { SQLTransaction, SQLError } from 'expo-sqlite';

export default function AddActivityScreen() {
  const router = useRouter();
  const [steps, setSteps] = useState('');

  const handleAdd = () => {
    const stepsNum = parseInt(steps, 10);
    if (isNaN(stepsNum) || stepsNum <= 0) {
      Alert.alert('Invalid input', 'Please enter a valid number of steps.');
      return;
    }

    const db = getDb();
    const now = Math.floor(Date.now() / 1000); // UNIX timestamp

    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          'INSERT INTO activities (steps, date) VALUES (?, ?);',
          [stepsNum, now],
          () => {
            console.log('✅ Activity added');
            router.replace('/');
          },
          (_tx: SQLTransaction, error: SQLError) => {
            console.error('❌ Failed to insert activity:', error);
            return true;
          }
        );
      },
      (err: SQLError) => {
        console.error('Transaction failed:', err);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Step Count:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={steps}
        onChangeText={setSteps}
        placeholder="e.g. 2837"
      />
      <Button title="Add Activity" onPress={handleAdd} />
      <View style={{ marginTop: 16 }}>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  label: { fontSize: 18, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 20,
    borderRadius: 6,
    fontSize: 16,
  },
});
