import React from 'react';
import { Text, TextProps } from 'react-native';
import { colors, typography } from '../theme';

type Variant = 'heading' | 'body' | 'caption';

interface BhausTextProps extends TextProps {
  variant?: Variant;
}

const variantStyles: Record<Variant, TextProps['style']> = {
  heading: { fontFamily: typography.display, fontSize: 24, fontWeight: '700', color: colors.neutralDark },
  body: { fontFamily: typography.body, fontSize: 16, color: colors.neutralDark },
  caption: { fontFamily: typography.body, fontSize: 13, color: colors.neutralMid },
};

export const BhausText = ({ variant = 'body', style, ...props }: BhausTextProps) => (
  <Text {...props} style={[variantStyles[variant], style]} />
);
