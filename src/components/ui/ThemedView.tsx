import React from 'react';
import { View, ViewProps } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { colors } from '../../theme/colors';


interface ThemedViewProps extends ViewProps {
    lightBackgroundColor?: string;
    darkBackgroundColor?: string;
}

export function ThemedView({
    lightBackgroundColor,
    darkBackgroundColor,
    style,
    ...rest
}: ThemedViewProps) {
    const { scheme } = useColorScheme();

    const backgroundColor = scheme === 'dark'
        ? (darkBackgroundColor ?? colors.dark.background)
        : (lightBackgroundColor ?? colors.light.background);

    return <View style={[{ backgroundColor }, style]} {...rest} />;
}
