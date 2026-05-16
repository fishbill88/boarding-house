import React from 'react';
import { View } from 'react-native';
import { BillStatus, TenantStatus } from '@bhaus/types';
import { BhausText } from './BhausText';
import { colors, radii, spacing } from '../theme';

const statusColorMap: Record<string, string> = {
  [BillStatus.PAID]: colors.success,
  [BillStatus.UNPAID]: colors.accent,
  [BillStatus.OVERDUE]: colors.danger,
  [BillStatus.PENDING_APPROVAL]: colors.primary,
  [TenantStatus.APPROVED]: colors.success,
  [TenantStatus.PENDING]: colors.accent,
  [TenantStatus.REJECTED]: colors.danger,
};

export const BhausBadge = ({ status }: { status: BillStatus | TenantStatus }) => (
  <View style={{ backgroundColor: `${statusColorMap[status]}22`, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
    <BhausText variant="caption" style={{ color: statusColorMap[status], fontWeight: '600' }}>{status.replace('_', ' ')}</BhausText>
  </View>
);
