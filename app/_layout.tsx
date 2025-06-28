// app/_layout.tsx
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivitiesProvider } from '@/components/ActivitiesProvider'; // adjust if needed
import { DatabaseProvider } from '@/components/DatabaseProvider';     // adjust if needed
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider>
        <ActivitiesProvider>
          <View style={styles.container}>
            <Stack>
              <Stack.Screen name="index" options={{ title: 'Home' }} />
              <Stack.Screen name="add-activity" options={{ title: 'Add Activity' }} />
              <Stack.Screen name="edit-activity" options={{ title: 'Edit Activity' }} />
            </Stack>
            <StatusBar style="auto" />
          </View>
        </ActivitiesProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
