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
          <ThemedText style={styles.greeting}>Hello World!</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
            Chọn một trò chơi để bắt đầu bữa tiệc
          </ThemedText>
        </View>

        {/* Game Cards */}
        <View style={styles.cardsContainer}>
          <GameCard
            title="Vòng Quay May Mắn"
            description="Bạn đang đắn đo để đưa ra quyết định, hãy để vũ trụ ra tay!"
            emoji="🎡"
            gradientColors={['#6C5CE7', '#A29BFE']}
            onPress={() => router.push('/lucky-wheel')}
          />

          <GameCard
            title="Thật hay Thách"
            description="Nơi những bí mật được bật mí, những thử thách được thực hiện!"
            emoji="🤔"
            gradientColors={['#E17055', '#FDCB6E']}
            onPress={() => { }}
            disabled
            comingSoon
          />

          <GameCard
            title="Drinking Game"
            description="Nếu bạn không vui thì người khác sẽ vui!"
            emoji="🍻"
            gradientColors={['#00B894', '#55EFC4']}
            onPress={() => { }}
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
    paddingTop: 50,
    paddingBottom: 28,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    lineHeight: 40,
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
