import { View } from 'react-native';
import { BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function LandlordDashboardScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.lg, gap: spacing.md }}>
      <BhausText variant="heading" style={{ color: colors.primary }}>Landlord Overview</BhausText>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <BhausCard style={{ flex: 1 }}>
          <BhausText variant="caption">Total Tenants</BhausText>
          <BhausText variant="heading">0</BhausText>
        </BhausCard>
        <BhausCard style={{ flex: 1 }}>
          <BhausText variant="caption">Pending Approvals</BhausText>
          <BhausText variant="heading">0</BhausText>
        </BhausCard>
      </View>
      <BhausCard>
        <BhausText variant="caption">Pending Payments</BhausText>
        <BhausText variant="heading">0</BhausText>
      </BhausCard>
      <BhausCard>
        <BhausText style={{ fontWeight: '700' }}>Pending approvals preview</BhausText>
        <BhausText variant="caption" style={{ marginTop: spacing.sm }}>New tenant requests will show here for quick action.</BhausText>
      </BhausCard>
    </View>
  );
}
