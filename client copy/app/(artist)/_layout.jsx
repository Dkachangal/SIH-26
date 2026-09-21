import { Stack } from 'expo-router';

export default function ArtistLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" />
      <Stack.Screen name="Profile" />
      <Stack.Screen name="Feed" />
      <Stack.Screen name="Chat" />
      <Stack.Screen name="AddProduct" />
    </Stack>
  );
}