import { View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { houseApi } from '../../../src/api';

export default function HouseCodeScreen() {
  const codeQuery = useQuery({
    queryKey: ['house-code'],
    queryFn: async () => {
      const response = await houseApi.getCode();
      return response.data.data.houseCode as string;
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading">House Code</BhausText>
        <BhausText style={{ marginTop: spacing.md }}>{codeQuery.data ?? 'Loading...'}</BhausText>
      </BhausCard>
    </View>
  );
}
