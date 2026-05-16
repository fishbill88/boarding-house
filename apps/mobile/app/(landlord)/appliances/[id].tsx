import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BhausBadge, BhausButton, BhausCard, BhausInput, BhausText, colors, spacing } from '@bhaus/ui';
import { ApplianceStatus } from '@bhaus/types';
import { useApplianceDetail, useApproveAppliance, useRejectAppliance } from '../../../src/api/appliances';

export default function LandlordApplianceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: appliance, isLoading } = useApplianceDetail(id);
  const approve = useApproveAppliance();
  const reject = useRejectAppliance();
  const [billingType, setBillingType] = useState('FREE');
  const [fee, setFee] = useState('');

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <BhausText>Loading…</BhausText>
      </View>
    );
  }

  if (!appliance) return null;

  const handleApprove = () => {
    approve.mutate(
      { id, billingType, registrationFee: fee ? parseFloat(fee) : undefined },
      {
        onSuccess: () => { Alert.alert('Approved'); router.back(); },
        onError: () => Alert.alert('Error', 'Failed to approve'),
      },
    );
  };

  const handleReject = () => {
    Alert.alert('Reject', 'Reject this appliance?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () =>
          reject.mutate(id, {
            onSuccess: () => { Alert.alert('Rejected'); router.back(); },
          }),
      },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.neutralLight }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}>
      <BhausText variant="heading">Appliance Detail</BhausText>
      <BhausCard>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <BhausText variant="subheading">{appliance.name}</BhausText>
            <BhausBadge status={appliance.status as ApplianceStatus} />
          </View>
          <BhausText style={{ color: colors.neutralMid }}>Tenant: {appliance.tenant?.user?.fullName}</BhausText>
          {appliance.description && <BhausText style={{ color: colors.neutralMid }}>{appliance.description}</BhausText>}
          {appliance.watts && <BhausText style={{ color: colors.neutralMid }}>{appliance.watts}W</BhausText>}
        </View>
      </BhausCard>

      {appliance.status === 'PENDING' && (
        <BhausCard>
          <BhausText variant="subheading" style={{ marginBottom: spacing.md }}>Approve Settings</BhausText>
          <View style={{ gap: spacing.md }}>
            <BhausInput label="Billing Type (FREE / MONTHLY / ONE_TIME)" value={billingType} onChangeText={setBillingType} />
            <BhausInput label="Registration Fee (₱)" value={fee} onChangeText={setFee} keyboardType="numeric" placeholder="0" />
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
            <BhausButton title="Approve" variant="primary" onPress={handleApprove} style={{ flex: 1 }} loading={approve.isPending} />
            <BhausButton title="Reject" variant="ghost" onPress={handleReject} style={{ flex: 1 }} loading={reject.isPending} />
          </View>
        </BhausCard>
      )}
    </ScrollView>
  );
}
