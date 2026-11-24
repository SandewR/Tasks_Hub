import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { colors } from '../../lib/theme';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.secondary,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.ink,
      headerShadowVisible: false,
      headerShown: true,
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Dashboard',
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard-outline" color={typeof color === 'string' ? color : colors.accent} size={size} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle-outline" color={typeof color === 'string' ? color : colors.accent} size={size} />,
      }} />
    </Tabs>
  );
}
