import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AudioProvider } from '@/hooks/AudioProvider';
import { ThemeProvider as AppThemeProvider, useThemeContext } from '@/hooks/ThemeProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootApp() {
  const { activeColorScheme } = useThemeContext();

  return (
    <ThemeProvider value={activeColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="lucky-wheel"
          options={{
            headerBackTitle: 'Trang Chủ',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
      <StatusBar style={activeColorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AudioProvider>
      <AppThemeProvider>
        <RootApp />
      </AppThemeProvider>
    </AudioProvider>
  );
}
