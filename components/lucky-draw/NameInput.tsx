import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAudio } from '@/hooks/AudioProvider';

interface NameInputProps {
  names: string[];
  onNamesChange: (names: string[]) => void;
}

export default function NameInput({ names, onNamesChange }: NameInputProps) {
  const { playClick } = useAudio();
  const [text, setText] = useState(names.join('\n'));
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Sync external changes (like removing a winner) to the text area
  useEffect(() => {
    const currentLines = text.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    const isSame = currentLines.length === names.length && currentLines.every((val, index) => val === names[index]);
    
    if (!isSame) {
      setText(names.join('\n'));
    }
  }, [names]);

  const handleTextChange = (value: string) => {
    setText(value);
    const newNames = value.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    onNamesChange(newNames);
  };


  const handleClear = () => {
    setText('');
    onNamesChange([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      {/* Header actions */}
      <View style={styles.headerRow}>
        <ThemedText style={styles.title}>
          Participants ({names.length})
        </ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => {
              if (names.length > 0) {
                playClick();
                handleClear();
              }
            }}
            disabled={names.length === 0}
            activeOpacity={0.6}
            style={[styles.clearBtn, { backgroundColor: colors.inputBackground }]}
          >
            <ThemedText style={{ color: names.length === 0 ? colors.icon + '50' : colors.danger, fontSize: 14, fontWeight: '600' }}>
              Clear
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Multiline Text Input */}
      <TextInput
        style={[styles.textArea, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
        multiline
        textAlignVertical="top"
        placeholder={`Enter names here, separated by new lines...\nAlice\nBob\nCharlie`}
        placeholderTextColor={colors.icon}
        value={text}
        onChangeText={handleTextChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    height: 240,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    lineHeight: 28,
  },
});
