import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { BhausText, colors } from '@bhaus/ui';
import { useUnreadCount } from '../../src/api/notifications';

function NotificationIcon({ focused }: { focused: boolean }) {
  const { data } = useUnreadCount();
  const count = data?.count ?? 0;
  return (
    <View>
      <BhausText style={{ fontSize: 20 }}>🔔</BhausText>
      {count > 0 && (
        <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: colors.danger, borderRadius: 8, minWidth: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 }}>
          <BhausText style={{ color: colors.white, fontSize: 10, fontWeight: '700' }}>{count > 99 ? '99+' : count}</BhausText>
        </View>
      )}
    </View>
  );
}

export default function TenantLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bills/index" options={{ title: 'Bills' }} />
      <Tabs.Screen name="appliances/index" options={{ title: 'Appliances' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifications', tabBarIcon: NotificationIcon }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
