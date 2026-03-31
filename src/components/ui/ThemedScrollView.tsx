import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { colors } from '../../theme/colors';


interface ThemedScrollViewProps extends ScrollViewProps {
    lightBackgroundColor?: string;
    darkBackgroundColor?: string;
}

export function ThemedScrollView({
    lightBackgroundColor,
    darkBackgroundColor,
    style,
    contentContainerStyle,
    ...rest
}: ThemedScrollViewProps) {
    const { scheme } = useColorScheme();

    const backgroundColor = scheme === 'dark'
        ? (darkBackgroundColor ?? colors.dark.background)
        : (lightBackgroundColor ?? colors.light.background);

    return (
        <ScrollView
            style={[{ backgroundColor }, style]}
            contentContainerStyle={contentContainerStyle}
            {...rest}
        />
    );
}
