// app/_layout.jsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This allows Expo to freely route to (auth), (tabs), or (artist) */}
    </Stack>
  );
}