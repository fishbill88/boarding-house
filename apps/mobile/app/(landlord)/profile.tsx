import { View } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { useAuth } from '../../src/hooks/useAuth';
import { BhausAvatar, BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

export default function LandlordProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutralLight, padding: spacing.xl }}>
      <BhausCard style={{ alignItems: 'center', gap: spacing.sm }}>
        <BhausAvatar fullName={user?.fullName ?? 'Landlord User'} imageUrl={user?.avatarUrl} size={64} />
        <BhausText style={{ fontWeight: '700' }}>{user?.fullName ?? 'Landlord User'}</BhausText>
        <BhausText variant="caption">{user?.email ?? 'landlord@email.com'}</BhausText>
        <BhausButton title="Logout" variant="ghost" onPress={() => void logout()} />
      </BhausCard>
    </View>
  );
}
