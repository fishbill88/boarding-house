import { View } from 'react-native';
import { router } from 'expo-router';
import { BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function LandlordSettingsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl, gap: spacing.md }}>
      <BhausCard>
        <BhausText variant="heading">Settings</BhausText>
      </BhausCard>
      <BhausButton title="Billing Config" onPress={() => router.push('/(landlord)/settings/billing-config')} />
      <BhausButton title="House Code" variant="secondary" onPress={() => router.push('/(landlord)/settings/house-code')} />
    </View>
  );
}
