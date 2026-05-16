import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { BhausText } from './BhausText';
import { colors, radii, spacing } from '../theme';

interface BhausInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const BhausInput = ({ label, error, style, ...props }: BhausInputProps) => (
  <View style={{ marginBottom: spacing.md }}>
    <BhausText style={{ marginBottom: spacing.xs }}>{label}</BhausText>
    <TextInput
      {...props}
      style={[
        {
          borderWidth: 1,
          borderColor: error ? colors.danger : '#D7E3E1',
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: colors.white,
        },
        style,
      ]}
    />
    {error ? <BhausText variant="caption" style={{ color: colors.danger, marginTop: spacing.xs }}>{error}</BhausText> : null}
  </View>
);
