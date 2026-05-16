import { View } from 'react-native';
import { BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function ForgotPasswordScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading">Forgot Password</BhausText>
        <BhausText style={{ marginTop: spacing.md }}>Password reset delivery will be added in Phase 2.</BhausText>
      </BhausCard>
    </View>
  );
}
