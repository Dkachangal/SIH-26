// app/index.jsx
import { Redirect } from 'expo-router';

export default function EntryPoint() {
  // Redirect to the Signin/Role Selection page first instead of tabs
  return <Redirect href="/(auth)/SigninPage" />;
}