// components/ThemedText.tsx
import React from 'react';
import { Text, TextProps } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { colors } from '../../theme/colors';

interface ThemedTextProps extends TextProps {
    lightColor?: string;
    darkColor?: string;
}

export function ThemedText({ lightColor, darkColor, style, ...rest }: ThemedTextProps) {
    const { scheme } = useColorScheme();

    const color = scheme === 'dark'
        ? (darkColor ?? colors.dark.text)
        : (lightColor ?? colors.light.text);

    return <Text style={[{ color }, style]} {...rest} />;
}
