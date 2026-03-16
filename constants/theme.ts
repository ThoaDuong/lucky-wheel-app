import { Platform } from 'react-native';

const tintColorLight = '#6C5CE7';
const tintColorDark = '#A29BFE';

export const Colors = {
  light: {
    text: '#2D3436',
    background: '#F8F9FA',
    tint: tintColorLight,
    icon: '#636E72',
    tabIconDefault: '#636E72',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardBorder: '#E9ECEF',
    inputBackground: '#F1F3F5',
    inputBorder: '#DEE2E6',
    danger: '#FF6B6B',
    success: '#51CF66',
  },
  dark: {
    text: '#F8F9FA',
    background: '#1A1B2E',
    tint: tintColorDark,
    icon: '#ADB5BD',
    tabIconDefault: '#ADB5BD',
    tabIconSelected: tintColorDark,
    card: '#252842',
    cardBorder: '#3D3F5E',
    inputBackground: '#2D2F4E',
    inputBorder: '#3D3F5E',
    danger: '#FF6B6B',
    success: '#51CF66',
  },
};

export const WheelColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#F9CA24', // Yellow
  '#6C5CE7', // Purple
  '#FF9FF3', // Pink
  '#54A0FF', // Sky Blue
  '#FF9F43', // Orange
  '#1DD1A1', // Green
  '#EE5A24', // Deep Orange
  '#A29BFE', // Lavender
  '#FECA57', // Gold
];

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
