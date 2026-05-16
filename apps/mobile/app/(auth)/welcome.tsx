import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { BhausButton, BhausCard, BhausText, colors, spacing } from '@bhaus/ui';

const slides = [
  { title: 'Welcome to BHAUS', text: 'Manage your boarding house operations in one place.' },
  { title: 'Tenants & Landlords', text: 'Built for both tenants and landlords with role-based experiences.' },
  { title: 'Bills & Approvals', text: 'Track billing, approvals, and onboarding with confidence.' },
];

export default function WelcomeScreen() {
  const [index, setIndex] = useState(0);
  const slide = useMemo(() => slides[index], [index]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.primaryLight, justifyContent: 'center', padding: spacing.xl }}>
      <BhausCard>
        <BhausText variant="heading" style={{ color: colors.primary }}>BHAUS</BhausText>
        <BhausText style={{ marginTop: spacing.md, fontWeight: '700' }}>{slide.title}</BhausText>
        <BhausText style={{ marginTop: spacing.sm }}>{slide.text}</BhausText>
        <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
          {index < slides.length - 1 ? (
            <BhausButton title="Next" onPress={() => setIndex((value) => value + 1)} />
          ) : (
            <BhausButton title="Get Started" onPress={() => router.replace('/(auth)/login')} />
          )}
          <BhausButton title="Skip" variant="ghost" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </BhausCard>
    </View>
  );
}
