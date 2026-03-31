import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInputProps,
    ViewStyle
} from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native'; // Assuming lucide-react-native based on your snippet
import { colors as Colors } from '../../theme/colors';



interface ThemedTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    isPassword?: boolean;
    containerStyle?: ViewStyle;
}

export default function ThemedTextInput({
    label,
    error,
    icon: Icon,
    isPassword,
    style,
    containerStyle,
    ...rest
}: ThemedTextInputProps) {
    const { scheme } = useColorScheme();
    const [showPassword, setShowPassword] = useState(false);

    const isDark = scheme === 'dark';
    const colors = isDark ? Colors.dark : Colors.light;

    return (
        <View style={[styles.outerContainer, containerStyle]}>
            {label && (
                <Text style={[styles.label, { color: colors.text }]}>
                    {label}
                </Text>
            )}

            <View style={[
                styles.inputWrapper,
                {
                    backgroundColor: colors.background,
                    borderColor: error ? colors.error : colors.border
                }
            ]}>
                {Icon && (
                    <Icon
                        size={18}
                        color={colors.icon}
                        style={styles.inputIcon}
                    />
                )}

                <TextInput
                    style={[
                        styles.input,
                        { color: colors.text },
                        style
                    ]}
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry={isPassword && !showPassword}
                    {...rest}
                />

                {isPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                            <EyeOff size={18} color={colors.icon} />
                        ) : (
                            <Eye size={18} color={colors.icon} />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        marginBottom: 12,
        width: '100%',
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        height: '100%',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    }
});
