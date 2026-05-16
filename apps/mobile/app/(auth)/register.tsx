import { router } from 'expo-router';
import { View } from 'react-native';
import { BhausCard, BhausText, BhausButton, colors, spacing } from '@bhaus/ui';

export default function RegisterRoleScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, justifyContent: 'center', padding: spacing.xl, gap: spacing.lg }}>
      <BhausText variant="heading" style={{ color: colors.primary }}>Join BHAUS</BhausText>
      <BhausCard>
        <BhausText style={{ fontWeight: '700' }}>I'm a Tenant</BhausText>
        <BhausText variant="caption" style={{ marginVertical: spacing.sm }}>Use your house code to request onboarding approval.</BhausText>
        <BhausButton title="Continue as Tenant" onPress={() => router.push('/(auth)/register-tenant')} />
      </BhausCard>
      <BhausCard>
        <BhausText style={{ fontWeight: '700' }}>I'm a Landlord</BhausText>
        <BhausText variant="caption" style={{ marginVertical: spacing.sm }}>Set up your boarding house and invite tenants.</BhausText>
        <BhausButton title="Continue as Landlord" onPress={() => router.push('/(auth)/register-landlord')} />
      </BhausCard>
    </View>
  );
}
