// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { initDatabase } from './database';

// Type definitions
type RootStackParamList = {
  Home: undefined;
  AddActivity: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// HomeScreen component
function HomeScreen({ navigation }: { navigation: any }) {
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
    initDatabase().catch(error => {
      console.error('Failed to initialize database:', error);
    });
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