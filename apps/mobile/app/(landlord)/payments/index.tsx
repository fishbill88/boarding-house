import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { usePayments } from '../../../src/api/payments';

export default function LandlordPaymentsScreen() {
  const router = useRouter();
  const { data: payments, isLoading } = usePayments({ status: 'PENDING' });

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md }}>
        <BhausText variant="heading">Pending Payments</BhausText>
      </View>
      {isLoading ? (
        <BhausText style={{ textAlign: 'center', marginTop: spacing.xl, color: colors.neutralMid }}>Loading…</BhausText>
      ) : (
        <FlatList
          data={payments ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}
          ListEmptyComponent={<BhausText style={{ textAlign: 'center', color: colors.neutralMid }}>No pending payments.</BhausText>}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(landlord)/payments/${item.id}`)}>
              <BhausCard>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <BhausText style={{ fontWeight: '600' }}>₱{Number(item.amount).toLocaleString()}</BhausText>
                    <BhausText style={{ color: colors.neutralMid, fontSize: 13 }}>Bill: {item.bill?.type}</BhausText>
                    <BhausText style={{ color: colors.neutralMid, fontSize: 12 }}>{new Date(item.submittedAt).toLocaleDateString()}</BhausText>
                  </View>
                  <BhausText style={{ color: colors.accent, fontWeight: '600' }}>PENDING</BhausText>
                </View>
              </BhausCard>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
