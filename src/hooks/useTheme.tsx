import { useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export const useTheme = (): 'light' | 'dark' => {
    const [scheme, setScheme] = useState<'light' | 'dark'>(
        Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
    );

    useEffect(() => {
        const sub = Appearance.addChangeListener(({ colorScheme }) => {
            setScheme(colorScheme === 'dark' ? 'dark' : 'light');
        });
        return () => sub.remove();
    }, []);

    return scheme;
};
