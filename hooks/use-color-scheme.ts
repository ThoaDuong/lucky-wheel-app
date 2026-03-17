import { useColorScheme as useReactNativeColorScheme } from 'react-native';
import { useThemeContext } from './ThemeProvider';

export function useColorScheme() {
  try {
    const { activeColorScheme } = useThemeContext();
    return activeColorScheme;
  } catch (e) {
    return useReactNativeColorScheme() ?? 'light';
  }
}
