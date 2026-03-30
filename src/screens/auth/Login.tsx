import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useAuth } from '../../hooks/auth/useAuth';
import { navigate } from '../../navigations/navigationRef';
import { useLogin } from '../../hooks/auth/useAuthenticate';
import { LoginSchema } from '../../types';
import FieldError from '../../components/ErrorField';
import { log } from '../../lib/logger';
import AuthLayout from '../../layout/AuthLayout';

const { width, height } = Dimensions.get('window');
const OLIVE = '#7a8c3f';

export default function Login() {
    const { login } = useAuth();
    const { mutate } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    // Manual State Management
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const onSubmit = () => {
        // Manual Zod Validation
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
            <View style={styles.form}>
                {/* Email */}
                <Text style={styles.label}>Adresse e-mail</Text>
                <View style={styles.inputWrapper}>
                    <Mail size={18} color="#888" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="exemple@email.com"
                        placeholderTextColor="#aaa"
                        value={formData.email}
                        onChangeText={(val) => handleChange('email', val)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <FieldError message={errors.email} />

                {/* Password */}
                <Text style={styles.label}>Mot de passe</Text>
                <View style={styles.inputWrapper}>
                    <Lock size={18} color="#888" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="•••••••••••••••"
                        placeholderTextColor="#aaa"
                        value={formData.password}
                        onChangeText={(val) => handleChange('password', val)}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                        {showPassword ? (
                            <EyeOff size={18} color="#aaa" />
                        ) : (
                            <Eye size={18} color="#aaa" />
                        )}
                    </TouchableOpacity>
                </View>
                <FieldError message={errors.password} />

                {/* Forgot password */}
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => navigate('ResetPassword')}>
                        <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>
                </View>

                {/* Login button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={onSubmit}
                >
                    <Text style={styles.loginButtonText}>Se Connecter</Text>
                </TouchableOpacity>

                {/* Divider & Social Buttons (Unchanged) */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image
                            source={require('./../../assets/images/icons/google.png')}
                            style={styles.icons}
                        />
                        <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <Image
                            source={require('./../../assets/images/icons/facebook.png')}
                            style={styles.icons}
                        />
                        <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Pas encore de compte ? </Text>
                    <TouchableOpacity onPress={() => navigate('Register')}>
                        <Text style={styles.registerLink}>Créer un compte</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f2f0',
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
    },
    icons: {
        width: 15,
        aspectRatio: 1,
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
        marginBottom: 36,
    },
    form: {
        width: '100%',
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
        marginBottom: 4,
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
        marginTop: 8,
    },
    forgotText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
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
    },
    dividerText: {
        fontSize: 13,
        color: '#aaa',
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
        backgroundColor: '#fff',
    },
    socialText: {
        fontSize: 14,
        color: '#555',
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerText: {
        fontSize: 13,
        color: '#888',
    },
    registerLink: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
    },
});
