import { Tabs } from 'expo-router';

export default function LandlordLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Overview' }} />
      <Tabs.Screen name="tenants/index" options={{ title: 'Tenants' }} />
      <Tabs.Screen name="billing/index" options={{ title: 'Billing' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
