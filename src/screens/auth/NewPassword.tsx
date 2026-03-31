import React, { useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Lock } from 'lucide-react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigations/types';
import { NewPasswordSchema } from '../../types';
import { log } from '../../lib/logger';
import { useFinalizeReset } from '../../hooks/auth/useAuthenticate';
import { navigate } from '../../navigations/navigationRef';
import AuthLayout from '../../layout/AuthLayout';
import { ThemedView } from '../../components/ui/ThemedView';
import { ThemedText } from '../../components/ui/ThemedText';
import ThemedTextInput from '../../components/ui/ThemedTextInput';
import { OLIVE } from '../../theme/colors';


type VerifyRouteProp = RouteProp<RootStackParamList, 'NewPassword'>;

const NewPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const route = useRoute<VerifyRouteProp>();
    const { mutate } = useFinalizeReset();
    const { email, token } = route.params;

    const handleSubmit = () => {
        const payload = { password, confirmPassword };
        const result = NewPasswordSchema.safeParse(payload);

        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                formattedErrors[path] = issue.message;
            });
            setErrors(formattedErrors);
            return;
        }

        setErrors({});
        mutate({ password, email, token }, {
            onSuccess: () => navigate("Login"),
            onError: (e) => {
                log.error(e);
                setErrors({ password: e.message });
            }
        });
    };

    return (
        <AuthLayout
            title='Nouveau mot de passe'
            subTitle='Choisissez un mot de passe sécurisé pour protéger votre compte'
        >
            <ThemedView style={styles.form}>
                <ThemedTextInput
                    label="Mot de passe"
                    icon={Lock}
                    placeholder="•••••••••••••••"
                    isPassword={true}
                    value={password}
                    onChangeText={(val) => {
                        setPassword(val);
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    error={errors.password}
                />

                <ThemedTextInput
                    label="Confirmer le mot de passe"
                    icon={Lock}
                    placeholder="•••••••••••••••"
                    isPassword={true}
                    value={confirmPassword}
                    onChangeText={(val) => {
                        setConfirmPassword(val);
                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    error={errors.confirmPassword}
                />
            </ThemedView>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <ThemedText style={styles.buttonText}>Confirmer</ThemedText>
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
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NewPassword;
