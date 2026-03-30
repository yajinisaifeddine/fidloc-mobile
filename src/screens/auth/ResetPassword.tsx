import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { goBack, navigate } from '../../navigations/navigationRef';
import { useRequestReset } from '../../hooks/auth/useAuthenticate';
import { ResetPasswordEmailSchema } from '../../types'; // Ensure this is exported from your types
import { log } from '../../lib/logger';
import AuthLayout from '../../layout/AuthLayout';

const { width, height } = Dimensions.get('window');
const OLIVE = '#7a8c3f';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { mutate } = useRequestReset();

    const handleEmailChange = (val: string) => {
        setEmail(val);
        if (error) setError(null);
    };

    const handleSubmit = () => {
        const result = ResetPasswordEmailSchema.safeParse({ email });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setError(null);

        mutate(result.data, {
            onSuccess: () => navigate("Verify", { email: result.data.email, isResetPassword: true }),
            // Usually, you don't want to navigate on error for UX,
            // but keeping your logic of navigating to Verify anyway.
            onError: (err) => {
                log.error(err.message);
                navigate("Verify", { email: result.data.email, isResetPassword: true });
            },
        });
    };

    return (
        <AuthLayout
            title='Mot de passe oublié'
            subTitle='Réinitialisez votre mot de passe pour accéder à votre compte'
        >


            <View style={styles.form}>
                <Text style={styles.label}>Adresse e-mail</Text>
                <View style={[styles.inputWrapper, error && styles.inputError]}>
                    <Mail size={18} color={error ? '#ff4d4d' : "#888"} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="exemple@email.com"
                        placeholderTextColor="#aaa"
                        value={email}
                        onChangeText={handleEmailChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backRow} onPress={() => goBack()}>
                <ArrowLeft size={15} color={OLIVE} />
                <Text style={styles.backText}>Retour à la connexion</Text>
            </TouchableOpacity>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f2f0',
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
    },
    logo: {
        width: width / 1.5,
        height: height / 6,
        marginBottom: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 36,
    },
    form: {
        width: '100%',
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 12,
        height: 48,
    },
    inputError: {
        borderColor: '#ff4d4d',
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    button: {
        width: '100%',
        backgroundColor: OLIVE,
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    backRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    backText: {
        fontSize: 14,
        fontWeight: '600',
        color: OLIVE,
    },
});

export default ResetPassword;
