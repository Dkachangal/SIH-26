import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#10b981', headerShown: false }}>
      <Tabs.Screen name="Home" options={{ title: 'Explore', tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} /> }} />
      <Tabs.Screen name="Clusters" options={{ title: 'B2B Clusters', tabBarIcon: ({ color }) => <Ionicons name="cube" size={24} color={color} /> }} />
      <Tabs.Screen name="Settings" options={{ title: 'Settings', tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} /> }} />
    </Tabs>
  );
}