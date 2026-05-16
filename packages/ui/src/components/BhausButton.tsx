import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, ViewStyle } from 'react-native';
import { BhausText } from './BhausText';
import { colors, radii, spacing } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface BhausButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: Variant;
  loading?: boolean;
  style?: ViewStyle;
}

const variantStyle = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primaryLight },
  ghost: { backgroundColor: 'transparent' },
} as const;

const variantTextColor = {
  primary: colors.white,
  secondary: colors.primaryDark,
  ghost: colors.primary,
} as const;

export const BhausButton = ({ title, variant = 'primary', loading = false, disabled, style, ...props }: BhausButtonProps) => (
  <Pressable
    {...props}
    disabled={disabled || loading}
    style={[
      {
        borderRadius: radii.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
      },
      variantStyle[variant],
      (disabled || loading) && { opacity: 0.7 },
      style,
    ]}
  >
    {loading ? <ActivityIndicator color={variantTextColor[variant]} /> : <BhausText style={{ color: variantTextColor[variant], fontWeight: '600' }}>{title}</BhausText>}
  </Pressable>
);
