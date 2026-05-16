import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { useBillingSummary } from '../../../src/api/billing';

export default function LandlordBillingScreen() {
  const router = useRouter();
  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());
  const { data: summary, isLoading } = useBillingSummary(month, year);

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <BhausText variant="heading">Billing</BhausText>
        <BhausButton title="Generate" variant="secondary" onPress={() => router.push('/(landlord)/billing/generate')} style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs }} />
      </View>

      {isLoading ? (
        <BhausText style={{ textAlign: 'center', marginTop: spacing.xl, color: colors.neutralMid }}>Loading…</BhausText>
      ) : (
        <FlatList
          data={summary?.tenants ?? []}
          keyExtractor={(item) => item.tenantId}
          ListHeaderComponent={
            <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
              <BhausCard>
                <BhausText variant="subheading" style={{ marginBottom: spacing.sm }}>
                  {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </BhausText>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ alignItems: 'center' }}>
                    <BhausText style={{ color: colors.neutralMid, fontSize: 12 }}>Total Billed</BhausText>
                    <BhausText style={{ fontWeight: '700' }}>₱{Number(summary?.totalBilled ?? 0).toLocaleString()}</BhausText>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <BhausText style={{ color: colors.neutralMid, fontSize: 12 }}>Paid</BhausText>
                    <BhausText style={{ fontWeight: '700', color: colors.success }}>₱{Number(summary?.totalPaid ?? 0).toLocaleString()}</BhausText>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <BhausText style={{ color: colors.neutralMid, fontSize: 12 }}>Overdue</BhausText>
                    <BhausText style={{ fontWeight: '700', color: colors.danger }}>₱{Number(summary?.totalOverdue ?? 0).toLocaleString()}</BhausText>
                  </View>
                </View>
              </BhausCard>
              <TouchableOpacity onPress={() => router.push('/(landlord)/billing/bills/index')}>
                <BhausCard style={{ backgroundColor: colors.primaryLight }}>
                  <BhausText style={{ color: colors.primaryDark, fontWeight: '600', textAlign: 'center' }}>View All Bills →</BhausText>
                </BhausCard>
              </TouchableOpacity>
              <BhausText variant="subheading">Tenant Breakdown</BhausText>
            </View>
          }
          contentContainerStyle={{ padding: spacing.xl }}
          ListEmptyComponent={<BhausText style={{ textAlign: 'center', color: colors.neutralMid }}>No billing data for this period.</BhausText>}
          renderItem={({ item }) => (
            <BhausCard style={{ marginBottom: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <BhausText style={{ fontWeight: '600' }}>{item.tenantName}</BhausText>
                <View style={{ alignItems: 'flex-end' }}>
                  <BhausText style={{ fontSize: 13, color: colors.neutralMid }}>Billed: ₱{Number(item.totalBilled).toLocaleString()}</BhausText>
                  <BhausText style={{ fontSize: 13, color: colors.success }}>Paid: ₱{Number(item.totalPaid).toLocaleString()}</BhausText>
                </View>
              </View>
            </BhausCard>
          )}
        />
      )}
    </View>
  );
}
