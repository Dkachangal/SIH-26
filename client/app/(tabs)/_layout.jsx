import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        headerStyle: { backgroundColor: '#F8FAFC' },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          headerTitle: 'Welcome',
        }}
      />
      <Tabs.Screen
        name="Following"
        options={{
          title: 'Following',
          headerTitle: 'Following Profile',
        }}
      />
      <Tabs.Screen
        name="Fav"
        options={{
          title: 'Fav',
          headerTitle: 'Fav Profile',
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          headerTitle: 'Profile',
        }}
      />
    </Tabs>
  );
}