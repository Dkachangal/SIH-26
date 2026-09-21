import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function ArtistLayout() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4f46e5', headerShown: false }}>
      <Tabs.Screen name="Feed" options={{ title: 'Feed', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="Home" options={{ title: 'Upload', tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} /> }} />
      <Tabs.Screen name="Profile" options={{ title: 'Studio', tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}