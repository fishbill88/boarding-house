import React from 'react';
import { Image, View } from 'react-native';
import { BhausText } from './BhausText';
import { colors, radii } from '../theme';

interface BhausAvatarProps {
  fullName: string;
  imageUrl?: string;
  size?: number;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export const BhausAvatar = ({ fullName, imageUrl, size = 40 }: BhausAvatarProps) => {
  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} style={{ width: size, height: size, borderRadius: radii.pill }} />;
  }

  return (
    <View style={{ width: size, height: size, borderRadius: radii.pill, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
      <BhausText style={{ color: colors.primaryDark, fontWeight: '700' }}>{getInitials(fullName)}</BhausText>
    </View>
  );
};
