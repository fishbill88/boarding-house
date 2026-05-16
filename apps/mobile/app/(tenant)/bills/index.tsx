import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BhausBadge, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { BillStatus } from '@bhaus/types';
import { useMyBills } from '../../../src/api/billing';

const TABS = ['All', 'Unpaid', 'Overdue', 'Paid'] as const;
type Tab = (typeof TABS)[number];

const tabToStatus: Record<Tab, string | undefined> = {
  All: undefined,
  Unpaid: BillStatus.UNPAID,
  Overdue: BillStatus.OVERDUE,
  Paid: BillStatus.PAID,
};

export default function TenantBillsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const { data: bills, isLoading } = useMyBills(tabToStatus[activeTab] ? { status: tabToStatus[activeTab] } : undefined);

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md }}>
        <BhausText variant="heading">My Bills</BhausText>
      </View>
      <View style={{ flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.md, gap: spacing.sm }}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: 20,
              backgroundColor: activeTab === tab ? colors.primary : colors.white,
            }}
          >
            <BhausText style={{ color: activeTab === tab ? colors.white : colors.neutralMid, fontWeight: '600', fontSize: 13 }}>
              {tab}
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
            <TouchableOpacity onPress={() => router.push(`/(tenant)/bills/${item.id}`)}>
              <BhausCard>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <BhausText variant="subheading">{item.type}</BhausText>
                    <BhausText style={{ color: colors.neutralMid, fontSize: 13, marginTop: 2 }}>
                      Due {new Date(item.dueDate).toLocaleDateString()}
                    </BhausText>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: spacing.xs }}>
                    <BhausText style={{ fontWeight: '700', color: colors.neutralDark }}>₱{Number(item.amount).toLocaleString()}</BhausText>
                    <BhausBadge status={item.status} />
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
