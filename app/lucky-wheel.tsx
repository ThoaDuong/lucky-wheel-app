import NameInput from '@/components/lucky-draw/NameInput';
import SpinButton from '@/components/lucky-draw/SpinButton';
import SpinningWheel from '@/components/lucky-draw/SpinningWheel';
import WinnerModal from '@/components/lucky-draw/WinnerModal';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAudio } from '@/hooks/AudioProvider';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const DEFAULT_NAMES = ['Cơm Tấm', 'Bún Bò Huế', 'Phở', 'Bánh Mì', 'Hủ Tiếu', 'Bún Chả', 'Bún Riêu', 'Bánh Xèo'];

export default function LuckyDrawScreen() {
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { playClick } = useAudio();

  const handleSpin = useCallback(() => {
    if (names.length < 2 || spinning) return;
    setSpinning(true);
    setShowWinner(false);
    setWinner(null);
  }, [names.length, spinning]);

  const handleSpinEnd = useCallback((winnerName: string) => {
    setWinner(winnerName);
    setShowWinner(true);
  }, []);

  const handleSpinComplete = useCallback(() => {
    setSpinning(false);
  }, []);

  const handleRemoveWinner = useCallback(() => {
    if (winner) {
      const updated = names.filter((n) => n !== winner);
      setNames(updated);
    }
    setShowWinner(false);
    setWinner(null);
  }, [winner, names]);

  const handleCloseModal = useCallback(() => {
    setShowWinner(false);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Vòng Quay May Mắn',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: ({ canGoBack }) => canGoBack ? (
            <TouchableOpacity
              onPress={() => {
                playClick();
                router.back();
              }}
              style={{ padding: 8, marginLeft: Platform.OS === 'ios' ? -16 : 0, flexDirection: 'row', alignItems: 'center' }}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : null,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Wheel Section */}
            <View style={styles.wheelSection}>
              <SpinningWheel
                names={names}
                onSpinEnd={handleSpinEnd}
                spinning={spinning}
                onSpinComplete={handleSpinComplete}
              />
            </View>

            {/* Spin Button */}
            <View style={styles.buttonSection}>
              <SpinButton
                onPress={handleSpin}
                disabled={names.length < 2}
                spinning={spinning}
              />
            </View>

            {/* Name Input Panel */}
            <View style={styles.nameSection}>
              <NameInput names={names} onNamesChange={setNames} />
            </View>
          </ScrollView>

          {/* Winner Modal Overlay */}
          <WinnerModal
            visible={showWinner}
            winner={winner || ''}
            onClose={handleCloseModal}
            onRemoveWinner={handleRemoveWinner}
          />
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  wheelSection: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  buttonSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  nameSection: {
    marginTop: 8,
    paddingBottom: 16,
  },
});
