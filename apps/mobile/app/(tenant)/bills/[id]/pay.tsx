import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BhausButton, BhausCard, BhausInput, BhausText, colors, spacing } from '@bhaus/ui';
import { useSubmitPayment } from '../../../../src/api/payments';

export default function TenantPayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const submitPayment = useSubmitPayment();

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    submitPayment.mutate(
      { billId: id, amount: parsedAmount, proofImageUrl: proofUrl || undefined },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Payment submitted successfully');
          router.back();
        },
        onError: () => Alert.alert('Error', 'Failed to submit payment'),
      },
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.neutralLight }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}>
      <BhausText variant="heading">Submit Payment</BhausText>
      <BhausCard>
        <View style={{ gap: spacing.md }}>
          <BhausInput
            label="Amount (₱)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
          />
          <BhausInput
            label="Proof Image URL (optional)"
            value={proofUrl}
            onChangeText={setProofUrl}
            placeholder="https://..."
          />
        </View>
      </BhausCard>
      <BhausButton title="Submit Payment" onPress={handleSubmit} loading={submitPayment.isPending} />
    </ScrollView>
  );
}
