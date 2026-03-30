import React, { useState, } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { goBack, navigate } from '../../navigations/navigationRef';
import { storage } from '../../lib/storage';
import { log } from '../../lib/logger';
import { OtpInput } from 'react-native-otp-entry';
import { useResend, useVerify, useVerifyReset } from '../../hooks/auth/useAuthenticate';
import { RootStackParamList } from '../../navigations/types';
import { useAuth } from '../../hooks/auth/useAuth';
const { width, height } = Dimensions.get("window")
import { RouteProp, useRoute } from '@react-navigation/native';
import AuthLayout from '../../layout/AuthLayout';

type VerifyRouteProp = RouteProp<RootStackParamList, 'Verify'>;

const Verify = () => {
    const route = useRoute<VerifyRouteProp>()
    const { email, isResetPassword } = route.params;

    log.debug(email, isResetPassword)
    const [token, setToken] = useState<string>("");

    const { mutate: verifyAccount } = useVerify()
    const { login } = useAuth()
    const { mutate: resetPassword } = useVerifyReset()
    const { mutate: resendToken } = useResend()
    const handleResend = () => {
        resendToken({ email })
    }
    const handleVerify = () => {

        if (!(token.length === 6)) return;
        if (isResetPassword) {

            resetPassword({ email, token }, {

                onSuccess: (data) => {
                    navigate("NewPassword", { email, token })
                    log.debug(data.msg)
                }
            })
        } else {
            const userId = storage.getString("id")
            if (!userId) return;
            verifyAccount({ token, userId }, {
                onSuccess: ({ data }) => {
                    login(data.accessToken, data.refreshToken)
                    navigate("Home")
                },
                onError: (err) => log.error(err)
            })
        }

    }


    return (
        <AuthLayout
            title='Vérification'
            subTitle='Entrez le code de vérification'
        >
            {/* Input Fields */}
            <OtpInput
                numberOfDigits={6}
                focusColor="#7a8c3f"
                theme={{
                    containerStyle: styles.inputContainer,
                    inputsContainerStyle: { gap: 6 },
                    pinCodeContainerStyle: {
                        width: 40,
                        height: 50,
                        borderRadius: 8,
                        borderColor: '#D0D8E0',
                        backgroundColor: '#F8F9FA',
                    },
                    pinCodeTextStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#2C3E50',
                    },
                }}
                onTextChange={(text) => setToken(text)}
                onFilled={(code) => log.info(code)}
            />

            {/* Resend Code */}
            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Vous n&apos;avez pas reçu un code ?</Text>
                <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendLink}>Re-envoyer</Text>
                </TouchableOpacity>
            </View>
            {/* Return to previous Code */}
            <View style={styles.returnContainer}>
                <Text style={styles.resendText}>Informations incorrectes ? </Text>
                <TouchableOpacity onPress={() => goBack()}>
                    <Text style={styles.resendLink}>Modifier mes informations</Text>
                </TouchableOpacity>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
                style={[styles.button, token.length !== 6 && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={token.length !== 6}
            >
                <Text style={styles.buttonText}>Vérifier</Text>
            </TouchableOpacity>
        </AuthLayout >
    );
};
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: width / 1.5,
        height: height / 6,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5A6C7D',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 32,
        width: "60%"
    },
    input: {
        width: 40,
        height: 50,
        borderWidth: 2,
        borderColor: '#D0D8E0',
        borderRadius: 8,
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        backgroundColor: '#F8F9FA',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
    returnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        gap: 4,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        gap: 4,
    },

    resendText: {
        fontSize: 12,
        color: '#7A8A9A',
    },
    resendLink: {
        fontSize: 12,
        color: '#6BA577',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    button: {
        width: '100%',
        paddingVertical: 14,
        backgroundColor: '#6BA577',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#A8C9A0',
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default Verify;
