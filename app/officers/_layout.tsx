import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function OfficersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Create Officer',
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Officer Details',
        }} 
      />
    </Stack>
  );
}
