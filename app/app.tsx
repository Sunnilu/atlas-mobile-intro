// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { initDb } from './lib/db'; // ✅ Corrected import

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Text>Steps: 0</Text>
      <Text>Date: {new Date().toLocaleDateString()}</Text>
      <Text>Database Status: Connected</Text>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    try {
      initDb();
      console.log('✅ Database initialized');
    } catch (e) {
      console.error('❌ Failed to initialize DB:', e);
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Activity Tracker' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
