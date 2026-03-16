import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import GameCard from '@/components/GameCard';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>Welcome! 👋</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
            Choose a game to get the party started
          </ThemedText>
        </View>

        {/* Game Cards */}
        <View style={styles.cardsContainer}>
          <GameCard
            title="Lucky Wheel"
            description="Spin the wheel and pick a lucky winner from your group!"
            emoji="🎡"
            gradientColors={['#6C5CE7', '#A29BFE']}
            onPress={() => router.push('/lucky-wheel')}
          />

          <GameCard
            title="Truth or Dare"
            description="The classic party game — truth, dare, or drink!"
            emoji="🤔"
            gradientColors={['#E17055', '#FDCB6E']}
            onPress={() => {}}
            disabled
            comingSoon
          />

          <GameCard
            title="Drinking Game"
            description="Fun challenges and rules to keep the party going!"
            emoji="🍻"
            gradientColors={['#00B894', '#55EFC4']}
            onPress={() => {}}
            disabled
            comingSoon
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 28,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 0,
  },
});
