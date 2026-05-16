import { View } from 'react-native';
import { BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function TenantDashboardScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.lg, gap: spacing.md }}>
      <BhausText variant="heading" style={{ color: colors.primary }}>Welcome back!</BhausText>
      <BhausCard>
        <BhausText style={{ fontWeight: '700' }}>Total Balance</BhausText>
        <BhausText variant="heading" style={{ marginTop: spacing.sm }}>₱0.00</BhausText>
        <BhausText variant="caption" style={{ marginTop: spacing.sm }}>Pending payments: 0</BhausText>
      </BhausCard>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}>
          <BhausButton title="Pay Bill" />
        </View>
        <View style={{ flex: 1 }}>
          <BhausButton title="Add Appliance" variant="secondary" />
        </View>
      </View>
      <BhausCard>
        <BhausText style={{ fontWeight: '700' }}>Recent Bills</BhausText>
        <BhausText variant="caption" style={{ marginTop: spacing.sm }}>Your recent bills will appear here after first sync.</BhausText>
      </BhausCard>
    </View>
  );
}
