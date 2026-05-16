import { View } from 'react-native';
import { BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function AnnounceScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading">Announcements</BhausText>
      </BhausCard>
    </View>
  );
}
