import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const colors = {
    light: { text: '#1a1a1a' },
    dark: { text: '#f1f1f1' },
};

const ThemedText: React.FC<TextProps> = ({ style, ...props }) => {
    const scheme = useTheme();
    const theme = scheme === 'dark' ? 'dark' : 'light';
    return (
        <Text style={[{ color: colors[theme].text }, style]} {...props} />
    );
};

export default ThemedText;
