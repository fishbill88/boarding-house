import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BhausBadge, BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { BillStatus } from '@bhaus/types';
import { useBillDetail } from '../../../../src/api/billing';
import { useApprovePayment, useRejectPayment } from '../../../../src/api/payments';

export default function LandlordBillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: bill, isLoading } = useBillDetail(id);
  const approvePayment = useApprovePayment();
  const rejectPayment = useRejectPayment();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <BhausText>Loading…</BhausText>
      </View>
    );
  }

  if (!bill) return null;

  const handleApprove = (paymentId: string) => {
    Alert.alert('Approve Payment', 'Are you sure you want to approve this payment?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: () => approvePayment.mutate(paymentId, { onSuccess: () => Alert.alert('Approved') }) },
    ]);
  };

  const handleReject = (paymentId: string) => {
    Alert.prompt('Reject Payment', 'Enter rejection reason:', (reason) => {
      if (reason) rejectPayment.mutate({ id: paymentId, rejectionReason: reason });
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.neutralLight }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}>
      <BhausText variant="heading">Bill Detail</BhausText>
      <BhausCard>
        <BhausText variant="subheading">Tenant</BhausText>
        <BhausText style={{ marginTop: spacing.xs }}>{bill.tenant?.user?.fullName}</BhausText>
      </BhausCard>
      <BhausCard>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BhausText style={{ color: colors.neutralMid }}>Type</BhausText>
            <BhausText style={{ fontWeight: '600' }}>{bill.type}</BhausText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BhausText style={{ color: colors.neutralMid }}>Amount</BhausText>
            <BhausText style={{ fontWeight: '700' }}>₱{Number(bill.amount).toLocaleString()}</BhausText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BhausText style={{ color: colors.neutralMid }}>Period</BhausText>
            <BhausText>{bill.billingMonth}/{bill.billingYear}</BhausText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <BhausText style={{ color: colors.neutralMid }}>Status</BhausText>
            <BhausBadge status={bill.status as BillStatus} />
          </View>
        </View>
      </BhausCard>

      {(bill.payments?.length ?? 0) > 0 && (
        <BhausCard>
          <BhausText variant="subheading" style={{ marginBottom: spacing.sm }}>Payment Submissions</BhausText>
          {(bill.payments ?? []).map((p: { id: string; amount: number | string; status: string; proofImageUrl?: string }) => (
            <View key={p.id} style={{ paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.neutralLight, gap: spacing.xs }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <BhausText>₱{Number(p.amount).toLocaleString()}</BhausText>
                <BhausText style={{ color: colors.neutralMid }}>{p.status}</BhausText>
              </View>
              {p.status === 'PENDING' && (
                <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
                  <BhausButton title="Approve" variant="primary" onPress={() => handleApprove(p.id)} style={{ flex: 1 }} />
                  <BhausButton title="Reject" variant="ghost" onPress={() => handleReject(p.id)} style={{ flex: 1 }} />
                </View>
              )}
            </View>
          ))}
        </BhausCard>
      )}
    </ScrollView>
  );
}
