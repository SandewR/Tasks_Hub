import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { enableForegroundNotifications } from '../lib/notifications';
import { colors } from '../lib/theme';

enableForegroundNotifications();

export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        headerTintColor: colors.ink,
        headerStyle: { backgroundColor: colors.surface },
        contentStyle: { backgroundColor: colors.bg },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-task" options={{ title: 'Add New Task', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
