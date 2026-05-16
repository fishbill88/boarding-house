import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { useMarkAllRead, useMarkNotificationRead, useNotifications } from '../../src/api/notifications';

export default function LandlordNotificationsScreen() {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();

  const notifications = data?.items ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <BhausText variant="heading">Notifications</BhausText>
        {notifications.some((n: { isRead: boolean }) => !n.isRead) && (
          <BhausButton title="Mark all read" variant="ghost" onPress={() => markAllRead.mutate()} style={{ paddingVertical: spacing.xs }} />
        )}
      </View>
      {isLoading ? (
        <BhausText style={{ textAlign: 'center', marginTop: spacing.xl, color: colors.neutralMid }}>Loading…</BhausText>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}
          ListEmptyComponent={<BhausText style={{ textAlign: 'center', color: colors.neutralMid }}>No notifications yet.</BhausText>}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => !item.isRead && markRead.mutate(item.id)}>
              <BhausCard style={{ borderLeftWidth: 3, borderLeftColor: item.isRead ? colors.neutralLight : colors.primary }}>
                <BhausText variant="subheading" style={{ color: item.isRead ? colors.neutralMid : colors.neutralDark }}>{item.title}</BhausText>
                <BhausText style={{ color: colors.neutralMid, marginTop: spacing.xs }}>{item.body}</BhausText>
                <BhausText style={{ color: colors.neutralMid, fontSize: 12, marginTop: spacing.xs }}>{new Date(item.createdAt).toLocaleDateString()}</BhausText>
              </BhausCard>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
