import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const colors = {
    light: { background: '#ffffff' },
    dark: { background: '#121212' },
};

const ThemedView: React.FC<ViewProps> = ({ style, ...props }) => {
    const scheme = useTheme();
    const theme = scheme === 'dark' ? 'dark' : 'light';
    return (
        <View style={[{ backgroundColor: colors[theme].background }, style]} {...props} />
    );
};

export default ThemedView;
