// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="add-activity" options={{ title: 'Add Activity' }} />
      <Stack.Screen name="edit-activity" options={{ title: 'Edit Activity' }} />
    </Stack>
  );
}
