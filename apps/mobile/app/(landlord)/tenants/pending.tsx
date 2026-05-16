import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';
import { tenantsApi } from '../../../src/api';

export default function PendingTenantsScreen() {
  const queryClient = useQueryClient();
  const pendingQuery = useQuery({
    queryKey: ['pending-tenants'],
    queryFn: async () => {
      const response = await tenantsApi.listPending();
      return response.data.data as Array<{ id: string; user: { fullName: string; email: string }; validIdUrl?: string }>;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => tenantsApi.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-tenants'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => tenantsApi.reject(id, 'Rejected by landlord'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-tenants'] }),
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.neutralLight }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <BhausText variant="heading" style={{ color: colors.primary }}>Pending Tenants</BhausText>
      {pendingQuery.data?.length ? pendingQuery.data.map((tenant) => (
        <BhausCard key={tenant.id}>
          <BhausText style={{ fontWeight: '700' }}>{tenant.user.fullName}</BhausText>
          <BhausText variant="caption">{tenant.user.email}</BhausText>
          <BhausText variant="caption" style={{ marginTop: spacing.sm }}>ID: {tenant.validIdUrl ? 'Uploaded' : 'Not uploaded yet'}</BhausText>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
            <View style={{ flex: 1 }}>
              <BhausButton title="Approve" loading={approveMutation.isPending} onPress={() => Alert.alert('Confirm', 'Approve this tenant?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Approve', onPress: () => approveMutation.mutate(tenant.id) },
              ])} />
            </View>
            <View style={{ flex: 1 }}>
              <BhausButton title="Reject" variant="secondary" loading={rejectMutation.isPending} onPress={() => Alert.alert('Confirm', 'Reject this tenant?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reject', onPress: () => rejectMutation.mutate(tenant.id) },
              ])} />
            </View>
          </View>
        </BhausCard>
      )) : <BhausCard><BhausText>No pending tenants.</BhausText></BhausCard>}
    </ScrollView>
  );
}
