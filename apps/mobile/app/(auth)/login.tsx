import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { BhausButton, BhausCard, BhausInput, BhausText, colors, spacing } from '@bhaus/ui';
import { loginSchema } from '../../src/api';
import { useAuth } from '../../src/hooks/useAuth';

type LoginValues = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { loginMutation } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, justifyContent: 'center', padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading" style={{ color: colors.primary, marginBottom: spacing.lg }}>Sign in to BHAUS</BhausText>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <BhausInput label="Email" autoCapitalize="none" keyboardType="email-address" value={value} onChangeText={onChange} error={errors.email?.message} />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <BhausInput label="Password" secureTextEntry value={value} onChangeText={onChange} error={errors.password?.message} />
          )}
        />

        {loginMutation.error ? <BhausText variant="caption" style={{ color: colors.danger, marginBottom: spacing.md }}>{(loginMutation.error as Error).message}</BhausText> : null}

        <BhausButton title="Login" loading={loginMutation.isPending} onPress={handleSubmit(async (values) => {
          const user = await loginMutation.mutateAsync(values);
          router.replace(user.role === 'LANDLORD' ? '/(landlord)' : '/(tenant)');
        })} />
        <BhausButton title="Create account" variant="ghost" onPress={() => router.push('/(auth)/register')} />
      </BhausCard>
    </View>
  );
}
