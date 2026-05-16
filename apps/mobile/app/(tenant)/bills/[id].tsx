import React from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BhausBadge, BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { useBillDetail } from '../../../src/api/billing';

export default function TenantBillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: bill, isLoading } = useBillDetail(id);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.neutralLight }}>
        <BhausText>Loading…</BhausText>
      </View>
    );
  }

  if (!bill) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.neutralLight }}>
        <BhausText>Bill not found.</BhausText>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.neutralLight }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}>
      <BhausText variant="heading">Bill Detail</BhausText>
      <BhausCard>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BhausText style={{ color: colors.neutralMid }}>Type</BhausText>
            <BhausText style={{ fontWeight: '600' }}>{bill.type}</BhausText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BhausText style={{ color: colors.neutralMid }}>Amount</BhausText>
            <BhausText style={{ fontWeight: '700', color: colors.neutralDark }}>₱{Number(bill.amount).toLocaleString()}</BhausText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BhausText style={{ color: colors.neutralMid }}>Period</BhausText>
            <BhausText>{bill.billingMonth}/{bill.billingYear}</BhausText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BhausText style={{ color: colors.neutralMid }}>Due Date</BhausText>
            <BhausText>{new Date(bill.dueDate).toLocaleDateString()}</BhausText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <BhausText style={{ color: colors.neutralMid }}>Status</BhausText>
            <BhausBadge status={bill.status} />
          </View>
          {bill.notes && (
            <View>
              <BhausText style={{ color: colors.neutralMid }}>Notes</BhausText>
              <BhausText>{bill.notes}</BhausText>
            </View>
          )}
        </View>
      </BhausCard>

      {(bill.payments?.length ?? 0) > 0 && (
        <BhausCard>
          <BhausText variant="subheading" style={{ marginBottom: spacing.sm }}>Payment History</BhausText>
          {(bill.payments ?? []).map((p: { id: string; amount: number | string; status: string; submittedAt: string }) => (
            <View key={p.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs }}>
              <BhausText style={{ fontSize: 13 }}>₱{Number(p.amount).toLocaleString()}</BhausText>
              <BhausText style={{ fontSize: 13, color: colors.neutralMid }}>{p.status}</BhausText>
              <BhausText style={{ fontSize: 13, color: colors.neutralMid }}>{new Date(p.submittedAt).toLocaleDateString()}</BhausText>
            </View>
          ))}
        </BhausCard>
      )}

      {(bill.status === 'UNPAID' || bill.status === 'OVERDUE') && (
        <BhausButton title="Submit Payment" onPress={() => router.push(`/(tenant)/bills/${id}/pay`)} />
      )}
    </ScrollView>
  );
}
