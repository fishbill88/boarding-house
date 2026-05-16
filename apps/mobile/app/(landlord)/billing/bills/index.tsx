import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BhausBadge, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { BillStatus } from '@bhaus/types';
import { useBills } from '../../../../src/api/billing';

const FILTERS = ['All', 'UNPAID', 'OVERDUE', 'PENDING_APPROVAL', 'PAID'] as const;
type Filter = (typeof FILTERS)[number];

export default function LandlordBillsListScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('All');
  const { data: bills, isLoading } = useBills(filter !== 'All' ? { status: filter } : undefined);

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md }}>
        <BhausText variant="heading">All Bills</BhausText>
      </View>
      <View style={{ flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.md, flexWrap: 'wrap', gap: spacing.xs }}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={{ paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 20, backgroundColor: filter === f ? colors.primary : colors.white }}
          >
            <BhausText style={{ color: filter === f ? colors.white : colors.neutralMid, fontSize: 12, fontWeight: '600' }}>
              {f.replace(/_/g, ' ')}
            </BhausText>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? (
        <BhausText style={{ textAlign: 'center', marginTop: spacing.xl, color: colors.neutralMid }}>Loading…</BhausText>
      ) : (
        <FlatList
          data={bills ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}
          ListEmptyComponent={<BhausText style={{ textAlign: 'center', color: colors.neutralMid }}>No bills found.</BhausText>}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(landlord)/billing/bills/${item.id}`)}>
              <BhausCard>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <BhausText style={{ fontWeight: '600' }}>{item.tenant?.user?.fullName ?? 'Tenant'}</BhausText>
                    <BhausText style={{ color: colors.neutralMid, fontSize: 13 }}>{item.type} — {item.billingMonth}/{item.billingYear}</BhausText>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: spacing.xs }}>
                    <BhausText style={{ fontWeight: '700' }}>₱{Number(item.amount).toLocaleString()}</BhausText>
                    <BhausBadge status={item.status as BillStatus} />
                  </View>
                </View>
              </BhausCard>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
