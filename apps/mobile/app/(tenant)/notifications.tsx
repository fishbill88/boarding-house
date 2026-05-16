import { View } from 'react-native';
import { BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function TenantNotificationsScreen() {
  return (
    <View style={{ flex: 1, padding: spacing.xl, backgroundColor: colors.neutralLight }}>
      <BhausCard>
        <BhausText variant="heading">Notifications</BhausText>
        <BhausText style={{ marginTop: spacing.md }}>No notifications yet.</BhausText>
      </BhausCard>
    </View>
  );
}
