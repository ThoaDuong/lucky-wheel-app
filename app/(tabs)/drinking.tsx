import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Animated, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDrinkingGame } from '@/hooks/useDrinkingGame';
import { useAudio } from '@/hooks/AudioProvider';

export default function DrinkingGameScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { playClick } = useAudio();

  const {
    phase,
    mode,
    currentText,
    truthCount,
    dareCount,
    handleSelectMode,
    handleNext,
    handleRestart,
    frontAnimatedStyle,
    backAnimatedStyle
  } = useDrinkingGame();

  const isLightMode = mode === 'nhẹ nhàng';

  return (
    <>
      <Tabs.Screen
        options={{
          headerShown: true,
          title: 'Drinking Game',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          tabBarStyle: { display: 'flex' },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                playClick();
                router.back();
              }}
              style={{ padding: 8, marginLeft: Platform.OS === 'ios' ? -16 : 0, flexDirection: 'row', alignItems: 'center' }}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        {phase === 'select_mode' ? (
          <ScrollView contentContainerStyle={styles.modeSelectionContainer}>
            <Text style={[styles.modeSelectionTitle, { color: colors.text }]}>Chọn Chế Độ Chơi</Text>

            <TouchableOpacity style={[styles.modeOptionButton, { backgroundColor: '#FFB8B8', marginBottom: 20 }]} onPress={() => handleSelectMode('nhẹ nhàng')}>
              <Text style={styles.modeOptionTitle}>Nhẹ Nhàng 🍻</Text>
              <Text style={styles.modeOptionDesc}>Uống nhẹ nhàng theo từng câu, đếm số thứ tự thẻ (50 câu).</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modeOptionButton, { backgroundColor: '#E17055' }]} onPress={() => handleSelectMode('sát phạt')}>
              <Text style={styles.modeOptionTitle}>Sát Phạt 💥</Text>
              <Text style={styles.modeOptionDesc}>Rút vòng không giới hạn. Uống sấp mặt!</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View style={styles.content}>
            <View style={styles.cardContainer}>
              <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle, { backgroundColor: colors.card }]}>
                <Text style={[styles.title, { color: colors.text }]}>Đến lượt bạn!</Text>
                <Text style={[styles.subtitle, { color: colors.icon }]}>Sẵn sàng chưa?</Text>
              </Animated.View>

              <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { backgroundColor: isLightMode ? '#FFB8B8' : '#E17055' }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTypeText}>{isLightMode ? 'Nhẹ Nhàng 🍻' : 'Sát Phạt 💥'}</Text>
                  {mode && (
                    <Text style={styles.cardCountText}>
                      {isLightMode ? truthCount : dareCount}/50
                    </Text>
                  )}
                </View>
                <Text style={styles.cardContentText}>{currentText}</Text>
              </Animated.View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.nextButton, { backgroundColor: colors.tint }]} onPress={handleNext}>
                <Text style={styles.buttonText}>Lượt tiếp theo</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.restartArea} onPress={handleRestart}>
              <Text style={{ color: colors.icon, textDecorationLine: 'underline' }}>Đổi chế độ chơi</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modeSelectionContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  modeSelectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  modeOptionButton: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modeOptionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modeOptionDesc: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    maxWidth: 400,
    marginBottom: 40,
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
  },
  cardTypeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  cardCountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0.9,
  },
  cardContentText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 38,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButton: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  restartArea: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
  }
});
