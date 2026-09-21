import { Redirect } from 'expo-router';
import { useAuth } from './_layout';

export default function Index() {
  const { user, token } = useAuth();

  if (!token) return <Redirect href="/(auth)/SigninPage" />;
  if (user?.role === 'artisan') return <Redirect href="/(artist)/Feed" />;
  return <Redirect href="/(tabs)/Home" />;
}