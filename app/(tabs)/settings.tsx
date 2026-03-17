import React from 'react';
import { StyleSheet, View, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { ThemedText } from '@/components/themed-text';
import { useAudio } from '@/hooks/AudioProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeContext, ThemeType } from '@/hooks/ThemeProvider';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SettingsScreen() {
  const { isMuted, volume, toggleMute, setGlobalVolume } = useAudio();
  const { theme, setTheme } = useThemeContext();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Cài Đặt</ThemedText>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Mute Toggle */}
          <View style={styles.row}>
            <View style={styles.rowLabel}>
              <IconSymbol name="speaker.wave.2.fill" size={22} color={colors.text} />
              <ThemedText style={styles.label}>Hiệu Ứng Âm Thanh</ThemedText>
            </View>
            <Switch
              value={!isMuted}
              onValueChange={toggleMute}
              trackColor={{ false: colors.icon + '40', true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.separator, { backgroundColor: colors.cardBorder }]} />

          {/* Volume Slider */}
          <View style={styles.volumeRow}>
            <View style={styles.rowLabel}>
              <IconSymbol name="speaker.1.fill" size={18} color={colors.icon} />
              <ThemedText style={styles.label}>Âm Lượng</ThemedText>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={setGlobalVolume}
              minimumTrackTintColor={colors.tint}
              maximumTrackTintColor={colors.icon + '40'}
              thumbTintColor={colors.tint}
              disabled={isMuted}
            />
            <IconSymbol name="speaker.3.fill" size={18} color={isMuted ? colors.icon + '40' : colors.icon} />
          </View>

          <View style={[styles.separator, { backgroundColor: colors.cardBorder, marginVertical: 12 }]} />

          {/* Theme Selection */}
          <View style={styles.rowLabel}>
            <IconSymbol name="moon.fill" size={22} color={colors.text} />
            <ThemedText style={styles.label}>Giao Diện</ThemedText>
          </View>
          <View style={styles.themeOptions}>
            {(['light', 'dark', 'system'] as ThemeType[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.themeOption,
                  { borderColor: colors.icon + '40' },
                  theme === t && { backgroundColor: colors.tint, borderColor: colors.tint }
                ]}
                onPress={() => setTheme(t)}
              >
                <ThemedText style={[
                  styles.themeOptionText,
                  theme === t ? { color: '#FFFFFF' } : { color: colors.text }
                ]}>
                  {t === 'light' ? 'Sáng' : t === 'dark' ? 'Tối' : 'Hệ thống'}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText style={[styles.version, { color: colors.icon }]}>Phiên bản 1.0.0</ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
  },
  section: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  volumeRow: {
    paddingVertical: 12,
    gap: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  separator: {
    height: 1,
    marginVertical: 4,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    fontWeight: '500',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
