import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function TenantBillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading">Bill {id}</BhausText>
      </BhausCard>
    </View>
  );
}
