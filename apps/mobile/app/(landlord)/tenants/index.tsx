import { View } from 'react-native';
import { router } from 'expo-router';
import { BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function LandlordTenantsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading">Tenants</BhausText>
        <BhausButton title="View Pending" onPress={() => router.push('/(landlord)/tenants/pending')} />
      </BhausCard>
    </View>
  );
}
