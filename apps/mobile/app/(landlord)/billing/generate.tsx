import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BhausButton, BhausCard, BhausInput, BhausText, colors, spacing } from '@bhaus/ui';
import { useGenerateBills } from '../../../src/api/billing';

export default function LandlordGenerateBillsScreen() {
  const router = useRouter();
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [electricity, setElectricity] = useState('');
  const [water, setWater] = useState('');
  const generateBills = useGenerateBills();

  const handleGenerate = () => {
    const m = parseInt(month);
    const y = parseInt(year);
    if (!m || m < 1 || m > 12 || !y) {
      Alert.alert('Error', 'Please enter a valid month (1-12) and year');
      return;
    }
    generateBills.mutate(
      {
        billingMonth: m,
        billingYear: y,
        electricityAmount: electricity ? parseFloat(electricity) : undefined,
        waterAmount: water ? parseFloat(water) : undefined,
      },
      {
        onSuccess: (data) => {
          Alert.alert('Success', `Generated ${data.generated} bill(s)`);
          router.back();
        },
        onError: () => Alert.alert('Error', 'Failed to generate bills'),
      },
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.neutralLight }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}>
      <BhausText variant="heading">Generate Bills</BhausText>
      <BhausCard>
        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <BhausInput label="Month (1-12)" value={month} onChangeText={setMonth} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <BhausInput label="Year" value={year} onChangeText={setYear} keyboardType="numeric" />
            </View>
          </View>
          <BhausInput label="Electricity Amount (₱)" value={electricity} onChangeText={setElectricity} keyboardType="numeric" placeholder="Leave blank to skip" />
          <BhausInput label="Water Amount (₱)" value={water} onChangeText={setWater} keyboardType="numeric" placeholder="Leave blank to skip" />
        </View>
      </BhausCard>
      <BhausCard style={{ backgroundColor: colors.primaryLight }}>
        <BhausText style={{ color: colors.primaryDark, fontSize: 13 }}>
          Bills will be generated for all approved tenants for the selected period. Tenants already billed for this period will be skipped.
        </BhausText>
      </BhausCard>
      <BhausButton title="Generate Bills" onPress={handleGenerate} loading={generateBills.isPending} />
    </ScrollView>
  );
}
