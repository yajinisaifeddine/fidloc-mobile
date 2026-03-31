import {
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { useState } from 'react';
import {
    Lock, Mail, UserRound,
} from 'lucide-react-native';
import { log } from '../../lib/logger';
import { storage } from '../../lib/storage';
import { navigate } from '../../navigations/navigationRef';
import { CreateUserSchema } from '../../types';
import { useSignUp } from '../../hooks/auth/useAuthenticate';
import AuthLayout from '../../layout/AuthLayout';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedView } from '../../components/ui/ThemedView';
import ThemedTextInput from '../../components/ui/ThemedTextInput';
import { OLIVE } from '../../theme/colors';



export default function Register() {
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const { mutate } = useSignUp();

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = () => {
        const payload = { ...formData, role: 'CLIENT' };
        const result = CreateUserSchema.safeParse(payload);

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
        mutate(result.data, {
            onSuccess: ({ data }) => {
                storage.set('id', data.id);
                storage.set('nom', formData.nom);
                storage.set('prenom', formData.prenom);
                storage.set('email', formData.email);
                navigate('Verify', { email: formData.email, isResetPassword: false });
            },
            onError: (err) => {
                log.error(err.message);
                setErrors({ email: err.message });
            },
        });
    };

    return (
        <AuthLayout
            title='Créer un compte'
            subTitle='Rejoignez votre espace personnel'
        >
            <ThemedView style={styles.form}>
                <ThemedView style={styles.nameRow}>
                    <ThemedTextInput
                        containerStyle={styles.nameField}
                        label="Prénom"
                        icon={UserRound}
                        placeholder="Votre Prénom"
                        value={formData.prenom}
                        onChangeText={(val) => handleChange('prenom', val)}
                        autoCapitalize="words"
                        error={errors.prenom}
                    />
                    <ThemedTextInput
                        containerStyle={styles.nameField}
                        label="Nom"
                        icon={UserRound}
                        placeholder="Votre Nom"
                        value={formData.nom}
                        onChangeText={(val) => handleChange('nom', val)}
                        autoCapitalize="words"
                        error={errors.nom}
                    />
                </ThemedView>

                <ThemedTextInput
                    label="Adresse e-mail"
                    icon={Mail}
                    placeholder="Exemple@email.com"
                    value={formData.email}
                    onChangeText={(val) => handleChange('email', val)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                />

                <ThemedTextInput
                    label="Mot de passe"
                    icon={Lock}
                    placeholder="•••••••••••••••"
                    isPassword={true}
                    value={formData.password}
                    onChangeText={(val) => handleChange('password', val)}
                    error={errors.password}
                />

                <ThemedTextInput
                    label="Confirmer le mot de passe"
                    icon={Lock}
                    placeholder="•••••••••••••••"
                    isPassword={true}
                    value={formData.confirmPassword}
                    onChangeText={(val) => handleChange('confirmPassword', val)}
                    error={errors.confirmPassword}
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                    <ThemedText style={styles.loginButtonText}>Créer un compte</ThemedText>
                </TouchableOpacity>

                <ThemedView style={styles.divider}>
                    <ThemedView style={styles.dividerLine} />
                    <ThemedText style={styles.dividerText}>ou</ThemedText>
                    <ThemedView style={styles.dividerLine} />
                </ThemedView>

                <ThemedView style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={require('./../../assets/images/icons/google.png')} style={styles.socialIcon} />
                        <ThemedText style={styles.socialText}>Google</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={require('./../../assets/images/icons/facebook.png')} style={styles.socialIcon} />
                        <ThemedText style={styles.socialText}>Facebook</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                <ThemedView style={styles.registerRow}>
                    <ThemedText style={styles.registerText}>Déjà un compte ? </ThemedText>
                    <TouchableOpacity onPress={() => navigate('Login')}>
                        <ThemedText style={styles.registerLink}>Se connecter</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    form: { width: '100%' },
    nameRow: { flexDirection: 'row', gap: 12 },
    nameField: { flex: 1 },
    loginButton: {
        backgroundColor: OLIVE,
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 24,
    },
    loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#ddd', opacity: 0.3 },
    dividerText: { fontSize: 13, opacity: 0.6 },
    socialRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
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
    socialIcon: { width: 18, height: 18 },
    socialText: { fontSize: 14, fontWeight: '500' },
    registerRow: { flexDirection: 'row', justifyContent: 'center' },
    registerText: { fontSize: 13, opacity: 0.7 },
    registerLink: { fontSize: 13, fontWeight: '700' },
});
