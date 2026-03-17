import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAudio } from '@/hooks/AudioProvider';

interface GameCardProps {
  title: string;
  description: string;
  emoji: string;
  gradientColors: [string, string];
  onPress: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function GameCard({
  title,
  description,
  emoji,
  gradientColors,
  onPress,
  disabled = false,
  comingSoon = false,
}: GameCardProps) {
  const { playClick } = useAudio();
  const scale = useSharedValue(1);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedTouchable
      onPress={() => {
        playClick();
        onPress();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      disabled={disabled}
      style={[
        styles.card,
        {
          backgroundColor: gradientColors[0],
          opacity: disabled ? 0.55 : 1,
        },
        animatedStyle,
      ]}
    >
      {/* Decorative accent */}
      <View style={[styles.accent, { backgroundColor: gradientColors[1] }]} />

      <View style={styles.content}>
        <View style={styles.emojiContainer}>
          <ThemedText style={styles.emoji}>{emoji}</ThemedText>
        </View>

        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.description}>{description}</ThemedText>
        </View>
      </View>

      {comingSoon && (
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>Sắp Ra Mắt</ThemedText>
        </View>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  accent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    borderBottomLeftRadius: 100,
    opacity: 0.3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    lineHeight: 18,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
