import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BhausBadge, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { ApplianceStatus } from '@bhaus/types';
import { useAppliances } from '../../../src/api/appliances';

const FILTERS = ['All', 'PENDING', 'APPROVED', 'REJECTED'] as const;
type Filter = (typeof FILTERS)[number];

export default function LandlordAppliancesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('All');
  const { data: appliances, isLoading } = useAppliances(filter !== 'All' ? { status: filter } : undefined);

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md }}>
        <BhausText variant="heading">Appliance Requests</BhausText>
      </View>
      <View style={{ flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.md, gap: spacing.sm }}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={{ paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 20, backgroundColor: filter === f ? colors.primary : colors.white }}
          >
            <BhausText style={{ color: filter === f ? colors.white : colors.neutralMid, fontSize: 12, fontWeight: '600' }}>{f}</BhausText>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? (
        <BhausText style={{ textAlign: 'center', marginTop: spacing.xl, color: colors.neutralMid }}>Loading…</BhausText>
      ) : (
        <FlatList
          data={appliances ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}
          ListEmptyComponent={<BhausText style={{ textAlign: 'center', color: colors.neutralMid }}>No appliances found.</BhausText>}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(landlord)/appliances/${item.id}`)}>
              <BhausCard>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <BhausText style={{ fontWeight: '600' }}>{item.name}</BhausText>
                    <BhausText style={{ color: colors.neutralMid, fontSize: 13 }}>{item.tenant?.user?.fullName}</BhausText>
                    {item.description && <BhausText style={{ color: colors.neutralMid, fontSize: 12 }}>{item.description}</BhausText>}
                  </View>
                  <BhausBadge status={item.status as ApplianceStatus} />
                </View>
              </BhausCard>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
