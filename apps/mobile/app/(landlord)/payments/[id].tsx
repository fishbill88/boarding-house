import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { useApprovePayment, usePaymentDetail, useRejectPayment } from '../../../src/api/payments';

export default function LandlordPaymentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: payment, isLoading } = usePaymentDetail(id);
  const approve = useApprovePayment();
  const reject = useRejectPayment();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <BhausText>Loading…</BhausText>
      </View>
    );
  }

  if (!payment) return null;

  const handleApprove = () => {
    Alert.alert('Approve Payment', 'Confirm approval?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: () =>
          approve.mutate(id, {
            onSuccess: () => { Alert.alert('Approved'); router.back(); },
            onError: () => Alert.alert('Error', 'Failed to approve'),
          }),
      },
    ]);
  };

  const handleReject = () => {
    Alert.prompt('Reject Payment', 'Enter rejection reason:', (reason) => {
      if (!reason) return;
      reject.mutate(
        { id, rejectionReason: reason },
        {
          onSuccess: () => { Alert.alert('Rejected'); router.back(); },
          onError: () => Alert.alert('Error', 'Failed to reject'),
        },
      );
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.neutralLight }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}>
      <BhausText variant="heading">Payment Detail</BhausText>
      <BhausCard>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BhausText style={{ color: colors.neutralMid }}>Amount</BhausText>
            <BhausText style={{ fontWeight: '700' }}>₱{Number(payment.amount).toLocaleString()}</BhausText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BhausText style={{ color: colors.neutralMid }}>Status</BhausText>
            <BhausText style={{ fontWeight: '600' }}>{payment.status}</BhausText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BhausText style={{ color: colors.neutralMid }}>Submitted</BhausText>
            <BhausText>{new Date(payment.submittedAt).toLocaleDateString()}</BhausText>
          </View>
          {payment.proofImageUrl && (
            <View>
              <BhausText style={{ color: colors.neutralMid }}>Proof</BhausText>
              <BhausText style={{ color: colors.primary }}>{payment.proofImageUrl}</BhausText>
            </View>
          )}
          {payment.rejectionReason && (
            <View>
              <BhausText style={{ color: colors.neutralMid }}>Rejection Reason</BhausText>
              <BhausText>{payment.rejectionReason}</BhausText>
            </View>
          )}
        </View>
      </BhausCard>

      {payment.status === 'PENDING' && (
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <BhausButton title="Approve" variant="primary" onPress={handleApprove} style={{ flex: 1 }} loading={approve.isPending} />
          <BhausButton title="Reject" variant="ghost" onPress={handleReject} style={{ flex: 1 }} loading={reject.isPending} />
        </View>
      )}
    </ScrollView>
  );
}
