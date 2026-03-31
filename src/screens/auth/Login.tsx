import {
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { useState } from 'react';
import { Lock, Mail } from 'lucide-react-native';
import { useAuth } from '../../hooks/auth/useAuth';
import { navigate } from '../../navigations/navigationRef';
import { useLogin } from '../../hooks/auth/useAuthenticate';
import { LoginSchema } from '../../types';
import { log } from '../../lib/logger';
import AuthLayout from '../../layout/AuthLayout';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedView } from '../../components/ui/ThemedView';
import ThemedTextInput from '../../components/ui/ThemedTextInput';
import { OLIVE } from '../../theme/colors';




export default function Login() {
    const { login } = useAuth();
    const { mutate } = useLogin();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const onSubmit = () => {
        const result = LoginSchema.safeParse(formData);

        if (!result.success) {
            const formattedErrors: any = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0];
                if (path) formattedErrors[path] = issue.message;
            });
            setErrors(formattedErrors);
            return;
        }

        log.debug('Validated Body:', result.data);

        mutate(result.data, {
            onSuccess: res => login(res.data.accessToken, res.data.refreshToken),
            onError: err => {
                setErrors({
                    email: err.message,
                    password: err.message,
                });
            },
        });
    };

    return (
        <AuthLayout
            title='Bienvenue !'
            subTitle='Connectez-vous à votre espace personnel'
        >
            <ThemedView style={styles.form}>
                {/* Email */}
                <ThemedTextInput
                    label="Adresse e-mail"
                    icon={Mail}
                    placeholder="exemple@email.com"
                    value={formData.email}
                    onChangeText={(val) => handleChange('email', val)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                />

                {/* Password */}
                <ThemedTextInput
                    label="Mot de passe"
                    icon={Lock}
                    isPassword={true}
                    placeholder="•••••••••••••••"
                    value={formData.password}
                    onChangeText={(val) => handleChange('password', val)}
                    error={errors.password}
                />

                {/* Forgot password */}
                <ThemedView style={styles.row}>
                    <TouchableOpacity onPress={() => navigate('ResetPassword')}>
                        <ThemedText style={styles.forgotText}>Mot de passe oublié ?</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {/* Login button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={onSubmit}
                >
                    <ThemedText style={styles.loginButtonText}>Se Connecter</ThemedText>
                </TouchableOpacity>

                {/* Divider */}
                <ThemedView style={styles.divider}>
                    <ThemedView style={styles.dividerLine} />
                    <ThemedText style={styles.dividerText}>ou</ThemedText>
                    <ThemedView style={styles.dividerLine} />
                </ThemedView>

                {/* Social Buttons */}
                <ThemedView style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image
                            source={require('./../../assets/images/icons/google.png')}
                            style={styles.socialIcon}
                        />
                        <ThemedText style={styles.socialText}>Google</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <Image
                            source={require('./../../assets/images/icons/facebook.png')}
                            style={styles.socialIcon}
                        />
                        <ThemedText style={styles.socialText}>Facebook</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {/* Register Link */}
                <ThemedView style={styles.registerRow}>
                    <ThemedText style={styles.registerText}>Pas encore de compte ? </ThemedText>
                    <TouchableOpacity onPress={() => navigate('Register')}>
                        <ThemedText style={styles.registerLink}>Créer un compte</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
        marginTop: 4,
    },
    forgotText: {
        fontSize: 13,
        fontWeight: '700',
    },
    loginButton: {
        backgroundColor: OLIVE,
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
        opacity: 0.3,
    },
    dividerText: {
        fontSize: 13,
        opacity: 0.6,
    },
    socialRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 28,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        height: 48,
    },
    socialIcon: {
        width: 18,
        height: 18,
    },
    socialText: {
        fontSize: 14,
        fontWeight: '500',
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    registerText: {
        fontSize: 13,
        opacity: 0.7,
    },
    registerLink: {
        fontSize: 13,
        fontWeight: '700',
    },
});
