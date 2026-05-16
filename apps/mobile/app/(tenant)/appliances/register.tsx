import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BhausButton, BhausCard, BhausInput, BhausText, colors, spacing } from '@bhaus/ui';
import { useRegisterAppliance } from '../../../src/api/appliances';
import { useCurrentUser } from '../../../src/hooks/useCurrentUser';

export default function TenantRegisterApplianceScreen() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [watts, setWatts] = useState('');
  const registerAppliance = useRegisterAppliance();

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Appliance name is required');
      return;
    }
    if (!user?.tenantProfile?.houseId) {
      Alert.alert('Error', 'No house associated with your account');
      return;
    }
    registerAppliance.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        watts: watts ? parseInt(watts) : undefined,
        houseId: user.tenantProfile.houseId,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Appliance registered for review');
          router.back();
        },
        onError: () => Alert.alert('Error', 'Failed to register appliance'),
      },
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.neutralLight }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}>
      <BhausText variant="heading">Register Appliance</BhausText>
      <BhausCard>
        <View style={{ gap: spacing.md }}>
          <BhausInput label="Name *" value={name} onChangeText={setName} placeholder="e.g. Electric Fan" />
          <BhausInput label="Description" value={description} onChangeText={setDescription} placeholder="Optional description" />
          <BhausInput label="Watts" value={watts} onChangeText={setWatts} keyboardType="numeric" placeholder="e.g. 60" />
        </View>
      </BhausCard>
      <BhausButton title="Submit for Approval" onPress={handleSubmit} loading={registerAppliance.isPending} />
    </ScrollView>
  );
}
