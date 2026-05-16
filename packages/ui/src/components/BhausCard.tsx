import React from 'react';
import { View, ViewProps } from 'react-native';
import { colors, radii, spacing } from '../theme';

export const BhausCard = ({ style, ...props }: ViewProps) => (
  <View
    {...props}
    style={[
      {
        backgroundColor: colors.white,
        borderRadius: radii.lg,
        padding: spacing.lg,
        shadowColor: '#00000022',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
      },
      style,
    ]}
  />
);
