import { View } from 'react-native';
import { BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function TenantBillsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading">Bills</BhausText>
        <BhausText style={{ marginTop: spacing.md }}>Billing list will be available after Phase 1 API data sync.</BhausText>
      </BhausCard>
    </View>
  );
}
