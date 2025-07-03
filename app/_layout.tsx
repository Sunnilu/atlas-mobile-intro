// app/_layout.tsx
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivitiesProvider } from '@/components/ActivitiesProvider';
import { DatabaseProvider } from '@/components/DatabaseProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider>
        <ActivitiesProvider>
          {/* ⛔️ Do NOT wrap Stack in <View> */}
          <Stack>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="add-activity" options={{ title: 'Add Activity' }} />
            <Stack.Screen name="edit-activity" options={{ title: 'Edit Activity' }} />
          </Stack>
          <StatusBar style="auto" />
        </ActivitiesProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}
