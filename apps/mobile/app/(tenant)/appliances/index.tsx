import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BhausBadge, BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { useMyAppliances } from '../../../src/api/appliances';

export default function TenantAppliancesScreen() {
  const router = useRouter();
  const { data: appliances, isLoading } = useMyAppliances();

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <BhausText variant="heading">My Appliances</BhausText>
        <BhausButton title="Register" variant="secondary" onPress={() => router.push('/(tenant)/appliances/register')} style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs }} />
      </View>
      {isLoading ? (
        <BhausText style={{ textAlign: 'center', marginTop: spacing.xl, color: colors.neutralMid }}>Loading…</BhausText>
      ) : (
        <FlatList
          data={appliances ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}
          ListEmptyComponent={<BhausText style={{ textAlign: 'center', color: colors.neutralMid }}>No appliances registered yet.</BhausText>}
          renderItem={({ item }) => (
            <BhausCard>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <BhausText variant="subheading">{item.name}</BhausText>
                  {item.description && <BhausText style={{ color: colors.neutralMid, fontSize: 13 }}>{item.description}</BhausText>}
                  {item.watts && <BhausText style={{ color: colors.neutralMid, fontSize: 13 }}>{item.watts}W</BhausText>}
                </View>
                <BhausBadge status={item.status} />
              </View>
            </BhausCard>
          )}
        />
      )}
    </View>
  );
}
