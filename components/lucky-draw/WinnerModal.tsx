import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAudio } from '@/hooks/AudioProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface WinnerModalProps {
  visible: boolean;
  winner: string;
  onClose: () => void;
  onRemoveWinner: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', '#6C5CE7', '#FF9FF3', '#FF9F43', '#1DD1A1'];

function ConfettiPiece({ delay, startX }: { delay: number; startX: number }) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT * 0.6, { duration: 2500 + Math.random() * 1500 })
    );
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-30 + Math.random() * 60, { duration: 400 }),
          withTiming(30 - Math.random() * 60, { duration: 400 })
        ),
        -1,
        true
      )
    );
    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration: 1000 + Math.random() * 2000 }), -1)
    );
    opacity.value = withDelay(
      delay + 2000,
      withTiming(0, { duration: 1500 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  const size = 6 + Math.random() * 8;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: -10,
          left: startX,
          width: size,
          height: size * (0.5 + Math.random() * 0.5),
          backgroundColor: color,
          borderRadius: Math.random() > 0.5 ? size / 2 : 2,
        },
        style,
      ]}
    />
  );
}

export default function WinnerModal({
  visible,
  winner,
  onClose,
  onRemoveWinner,
}: WinnerModalProps) {
  const { playWin, playClick } = useAudio();
  const scale = useSharedValue(0);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  useEffect(() => {
    if (visible) {
      playWin();
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 150,
      });
    } else {
      scale.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [0, 0.5, 1], [0, 0.8, 1]),
  }));

  if (!visible) return null;

  const confettiPieces = Array.from({ length: 30 }, (_, i) => (
    <ConfettiPiece
      key={i}
      delay={i * 80}
      startX={Math.random() * SCREEN_WIDTH}
    />
  ));

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      {/* Confetti */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {confettiPieces}
      </View>

      <Animated.View style={[styles.card, { backgroundColor: colors.card }, cardStyle]}>
        <View style={styles.trophyContainer}>
          <ThemedText style={styles.trophy}>🏆</ThemedText>
        </View>

        <ThemedText style={styles.congratsText}>Congratulations!</ThemedText>

        <View style={[styles.winnerBadge, { backgroundColor: colors.tint + '15' }]}>
          <ThemedText style={[styles.winnerName, { color: colors.tint }]}>
            {winner}
          </ThemedText>
        </View>

        <ThemedText style={[styles.subtitleText, { color: colors.icon }]}>
          is the lucky winner! 🎉
        </ThemedText>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              playClick();
              onRemoveWinner();
            }}
            style={[styles.squareBtn, styles.secondaryBtn, { borderColor: colors.danger }]}
          >
            <ThemedText style={[styles.squareBtnText, { color: colors.danger }]}>
              Remove
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              playClick();
              onClose();
            }}
            style={[styles.squareBtn, styles.primaryBtn, { backgroundColor: colors.tint }]}
          >
            <ThemedText style={[styles.squareBtnText, { color: '#FFFFFF' }]}>
              Close
            </ThemedText>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  card: {
    width: SCREEN_WIDTH * 0.85,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  trophyContainer: {
    marginBottom: 24,
  },
  trophy: {
    fontSize: 56,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  winnerBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitleText: {
    fontSize: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
  },
  squareBtn: {
    width: 100,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  primaryBtn: {
    // backgroundColor set inline
  },
  secondaryBtn: {
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  squareBtnText: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 22,
  },
  closeBtn: {
    paddingVertical: 8,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
