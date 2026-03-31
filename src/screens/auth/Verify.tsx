import React, { useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { goBack, navigate } from '../../navigations/navigationRef';
import { storage } from '../../lib/storage';
import { log } from '../../lib/logger';
import { OtpInput } from 'react-native-otp-entry';
import { useResend, useVerify, useVerifyReset } from '../../hooks/auth/useAuthenticate';
import { RootStackParamList } from '../../navigations/types';
import { useAuth } from '../../hooks/auth/useAuth';
import { RouteProp, useRoute } from '@react-navigation/native';
import AuthLayout from '../../layout/AuthLayout';
import { ThemedView } from '../../components/ui/ThemedView';
import { ThemedText } from '../../components/ui/ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';
import { OLIVE } from '../../theme/colors';

type VerifyRouteProp = RouteProp<RootStackParamList, 'Verify'>;


const Verify = () => {
    const route = useRoute<VerifyRouteProp>();
    const { email, isResetPassword } = route.params;
    const [token, setToken] = useState<string>("");

    const { mutate: verifyAccount } = useVerify();
    const { login } = useAuth();
    const { mutate: resetPassword } = useVerifyReset();
    const { mutate: resendToken } = useResend();

    const borderColor = useThemeColor({}, 'icon');
    const textColor = useThemeColor({}, 'text');
    const inputBg = useThemeColor({ light: '#F8F9FA', dark: '#252525' }, 'background');

    const handleResend = () => {
        resendToken({ email });
    };

    const handleVerify = () => {
        if (token.length !== 6) return;

        if (isResetPassword) {
            resetPassword({ email, token }, {
                onSuccess: () => {
                    navigate("NewPassword", { email, token });
                }
            });
        } else {
            const userId = storage.getString("id");
            if (!userId) return;
            verifyAccount({ token, userId }, {
                onSuccess: ({ data }) => {
                    login(data.accessToken, data.refreshToken);
                    navigate("MainTabs");
                },
                onError: (err) => log.error(err)
            });
        }
    };

    return (
        <AuthLayout
            title='Vérification'
            subTitle='Entrez le code de vérification envoyé par e-mail'
        >
            <ThemedView style={styles.formContainer}>
                <OtpInput
                    numberOfDigits={6}
                    focusColor={OLIVE}
                    theme={{
                        containerStyle: styles.otpContainer,
                        inputsContainerStyle: { gap: 8 },
                        // Use flatten to merge the array into one object
                        pinCodeContainerStyle: StyleSheet.flatten([
                            styles.pinCodeContainer,
                            { borderColor, backgroundColor: inputBg }
                        ]),
                        pinCodeTextStyle: StyleSheet.flatten([
                            styles.pinCodeText,
                            { color: textColor }
                        ]),
                        focusStickStyle: { backgroundColor: OLIVE },
                    }}
                    onTextChange={setToken}
                />

                <ThemedView style={styles.linkContainer}>
                    <ThemedText style={styles.infoText}>Vous n'avez pas reçu de code ?</ThemedText>
                    <TouchableOpacity onPress={handleResend}>
                        <ThemedText style={styles.linkText}>Renvoyer</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                <ThemedView style={styles.linkContainer}>
                    <ThemedText style={styles.infoText}>Informations incorrectes ?</ThemedText>
                    <TouchableOpacity onPress={() => goBack()}>
                        <ThemedText style={styles.linkText}>Modifier</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                <TouchableOpacity
                    style={[styles.button, token.length !== 6 && styles.buttonDisabled]}
                    onPress={handleVerify}
                    disabled={token.length !== 6}
                >
                    <ThemedText style={styles.buttonText}>Vérifier</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    otpContainer: {
        marginBottom: 32,
        marginTop: 10,
    },
    pinCodeContainer: {
        width: 45,
        height: 55,
        borderRadius: 10,
        borderWidth: 1,
    },
    pinCodeText: {
        fontSize: 20,
        fontWeight: '700',
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    infoText: {
        fontSize: 13,
        opacity: 0.7,
    },
    linkText: {
        fontSize: 13,
        fontWeight: '700',
        color: OLIVE,
        textDecorationLine: 'underline',
    },
    button: {
        width: '100%',
        backgroundColor: OLIVE,
        borderRadius: 10,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Verify;
