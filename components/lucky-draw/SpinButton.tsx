import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAudio } from '@/hooks/AudioProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SpinButtonProps {
  onPress: () => void;
  disabled: boolean;
  spinning: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function SpinButton({ onPress, disabled, spinning }: SpinButtonProps) {
  const { playClick } = useAudio();

  const pulseScale = useSharedValue(1);
  const pressScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  useEffect(() => {
    if (!disabled && !spinning) {
      // Pulse animation
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800 }),
          withTiming(0.2, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseScale);
      cancelAnimation(glowOpacity);
      pulseScale.value = withTiming(1, { duration: 200 });
      glowOpacity.value = withTiming(0.1, { duration: 200 });
    }
  }, [disabled, spinning]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value * pressScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    if (disabled || spinning) return;
    playClick();
    pressScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    onPress();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View style={styles.wrapper}>
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glow,
          { backgroundColor: colors.tint },
          glowStyle,
        ]}
      />

      <AnimatedTouchable
        onPress={handlePress}
        activeOpacity={0.9}
        disabled={disabled || spinning}
        style={[
          styles.button,
          {
            backgroundColor: disabled ? colors.icon + '40' : colors.tint,
          },
          animatedStyle,
        ]}
      >
        <ThemedText style={styles.buttonText}>
          {spinning ? '🎡 Spinning...' : '🎯 SPIN'}
        </ThemedText>
      </AnimatedTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 60,
    borderRadius: 30,
    transform: [{ scaleX: 1.3 }, { scaleY: 1.5 }],
  },
  button: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
});
