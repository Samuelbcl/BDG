import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="notifications"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="search"
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack>
    </>
  );
}
