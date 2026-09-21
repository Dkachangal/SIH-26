import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ArtistLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4f46e5', headerShown: false }}>
      <Tabs.Screen 
        name="Home" 
        options={{ 
          title: 'Upload', 
          tabBarIcon: ({ color, size }) => <Ionicons name="cloud-upload-outline" size={size} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="Feed" 
        options={{ 
          title: 'Marketplace', 
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="Profile" 
        options={{ 
          title: 'Studio', 
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> 
        }} 
      />
    </Tabs>
  );
}