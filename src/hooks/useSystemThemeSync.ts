import { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useColorScheme } from './useColorScheme';
import SystemNavigationBar from 'react-native-system-navigation-bar';

export const useSystemThemeSync = () => {
  const { scheme } = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
    const bgColor = isDark ? '#1e1e1e' : '#ffffff';
    const barStyle = isDark ? 'light' : 'dark';

    if (Platform.OS === 'android') {
      try {
        // Sets Navigation Bar color, Icon style, and Bar visibility/partition
        SystemNavigationBar.setNavigationColor(bgColor, barStyle, 'both');

        // Sync Status Bar background
        StatusBar.setBackgroundColor(bgColor);
      } catch (e) {
        console.error('System Navigation Error:', e);
      }
    }

    // Update Status Bar Icons (iOS & Android)
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [isDark]);
};
