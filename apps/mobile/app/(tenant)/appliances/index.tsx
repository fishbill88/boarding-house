import { View } from 'react-native';
import { BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function TenantAppliancesScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading">Appliances</BhausText>
        <BhausText style={{ marginTop: spacing.md }}>Register and track tenant appliances here.</BhausText>
      </BhausCard>
    </View>
  );
}
