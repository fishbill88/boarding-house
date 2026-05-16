import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { BhausButton, BhausCard, BhausInput, BhausText, colors, spacing } from '@bhaus/ui';
import { registerSchema } from '../../src/api';
import { useAuth } from '../../src/hooks/useAuth';

type TenantRegisterValues = {
  houseCode: string;
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterTenantScreen() {
  const { registerMutation } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<TenantRegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { houseCode: '', fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading" style={{ color: colors.primary, marginBottom: spacing.lg }}>Tenant Registration</BhausText>
        {(['houseCode', 'fullName', 'email', 'phone', 'password', 'confirmPassword'] as const).map((field) => (
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
        <BhausButton title="Create Tenant Account" loading={registerMutation.isPending} onPress={handleSubmit(async (values) => {
          await registerMutation.mutateAsync({ ...values, role: 'TENANT' });
          router.replace('/(tenant)');
        })} />
      </BhausCard>
    </View>
  );
}
