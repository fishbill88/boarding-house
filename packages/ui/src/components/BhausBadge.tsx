import React from 'react';
import { View } from 'react-native';
import { ApplianceStatus, BillStatus, TenantStatus } from '@bhaus/types';
import { BhausText } from './BhausText';
import { colors, radii, spacing } from '../theme';

// ApplianceStatus shares the same string values as TenantStatus (PENDING/APPROVED/REJECTED)
const statusColorMap: Record<string, string> = {
  [BillStatus.PAID]: colors.success,
  [BillStatus.UNPAID]: colors.accent,
  [BillStatus.OVERDUE]: colors.danger,
  [BillStatus.PENDING_APPROVAL]: colors.primary,
  [TenantStatus.APPROVED]: colors.success,
  [TenantStatus.PENDING]: colors.accent,
  [TenantStatus.REJECTED]: colors.danger,
};

export const BhausBadge = ({ status }: { status: BillStatus | TenantStatus | ApplianceStatus | string }) => (
  <View style={{ backgroundColor: `${statusColorMap[status] ?? colors.neutralMid}22`, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
    <BhausText variant="caption" style={{ color: statusColorMap[status] ?? colors.neutralMid, fontWeight: '600' }}>{String(status).replace(/_/g, ' ')}</BhausText>
  </View>
);
