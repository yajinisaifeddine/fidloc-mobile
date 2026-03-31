import {
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { goBack, navigate } from '../../navigations/navigationRef';
import { useRequestReset } from '../../hooks/auth/useAuthenticate';
import { ResetPasswordEmailSchema } from '../../types';
import { log } from '../../lib/logger';
import AuthLayout from '../../layout/AuthLayout';
import { ThemedView } from '../../components/ui/ThemedView';
import { ThemedText } from '../../components/ui/ThemedText';
import ThemedTextInput from '../../components/ui/ThemedTextInput';
import { OLIVE } from '../../theme/colors';



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
            onError: (err) => {
                log.error(err.message);
                // Navigating anyway per existing logic
                navigate("Verify", { email: result.data.email, isResetPassword: true });
            },
        });
    };

    return (
        <AuthLayout
            title='Mot de passe oublié'
            subTitle='Réinitialisez votre mot de passe pour accéder à votre compte'
        >
            <ThemedView style={styles.form}>
                <ThemedTextInput
                    label="Adresse e-mail"
                    icon={Mail}
                    placeholder="exemple@email.com"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={error ?? undefined}
                />
            </ThemedView>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <ThemedText style={styles.buttonText}>Valider</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backRow} onPress={() => goBack()}>
                <ArrowLeft size={16} color={OLIVE} />
                <ThemedText style={styles.backText}>Retour à la connexion</ThemedText>
            </TouchableOpacity>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    form: {
        width: '100%',
        marginBottom: 24,
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
        gap: 8,
        alignSelf: 'center',
    },
    backText: {
        fontSize: 14,
        fontWeight: '600',
        color: OLIVE,
    },
});

export default ResetPassword;
