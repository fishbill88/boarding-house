import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { BhausButton, BhausCard, BhausInput, BhausText, colors, spacing } from '@bhaus/ui';
import { registerSchema } from '../../src/api';
import { useAuth } from '../../src/hooks/useAuth';

type LandlordRegisterValues = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  houseName: string;
  houseAddress: string;
};

export default function RegisterLandlordScreen() {
  const { registerMutation } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<LandlordRegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '', houseName: '', houseAddress: '' },
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading" style={{ color: colors.primary, marginBottom: spacing.lg }}>Landlord Registration</BhausText>
        {(['fullName', 'email', 'phone', 'password', 'confirmPassword', 'houseName', 'houseAddress'] as const).map((field) => (
          <Controller
            key={field}
            control={control}
            name={field}
            render={({ field: { onChange, value } }) => (
              <BhausInput
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                value={value ?? ''}
                onChangeText={onChange}
                secureTextEntry={field.toLowerCase().includes('password')}
                error={errors[field]?.message}
              />
            )}
          />
        ))}
        <BhausButton title="Create Landlord Account" loading={registerMutation.isPending} onPress={handleSubmit(async (values) => {
          await registerMutation.mutateAsync({ ...values, role: 'LANDLORD' });
          router.replace('/(landlord)');
        })} />
      </BhausCard>
    </View>
  );
}
