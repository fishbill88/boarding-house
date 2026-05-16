import { View } from 'react-native';
import { BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function LandlordBillingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading">Billing</BhausText>
      </BhausCard>
    </View>
  );
}
