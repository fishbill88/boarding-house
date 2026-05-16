import { Tabs } from 'expo-router';

export default function TenantLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bills/index" options={{ title: 'Bills' }} />
      <Tabs.Screen name="appliances/index" options={{ title: 'Appliances' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
