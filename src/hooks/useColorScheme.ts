// hooks/useColorScheme.ts
import { useState, useEffect, useCallback } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export function useColorScheme() {
  const [scheme, setScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() ?? 'light',
  );
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (!isManual) {
        setScheme(colorScheme ?? 'light');
      }
    });
    return () => sub.remove();
  }, [isManual]);

  const setColorScheme = useCallback((newScheme: ColorSchemeName) => {
    setScheme(newScheme);
    setIsManual(true);
  }, []);

  const resetToSystem = useCallback(() => {
    setIsManual(false);
    setScheme(Appearance.getColorScheme() ?? 'light');
  }, []);

  return { scheme, setColorScheme, resetToSystem };
}
