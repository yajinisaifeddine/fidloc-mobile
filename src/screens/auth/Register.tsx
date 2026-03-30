import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { useState } from 'react';
import {
    Eye, EyeOff, Lock, Mail, UserRound,
} from 'lucide-react-native';
import { log } from '../../lib/logger';
import { storage } from '../../lib/storage';
import { navigate } from '../../navigations/navigationRef';
import { CreateUserSchema } from '../../types';
import { useSignUp } from '../../hooks/auth/useAuthenticate';
import AuthLayout from '../../layout/AuthLayout';

const { width, height } = Dimensions.get('window');


export default function Register() {
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
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
        const payload = {
            ...formData,
            role: 'CLIENT',
        };

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
        log.info('Validated Signup Payload:', result.data);

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

            <View style={styles.form}>

                <View style={styles.nameRow}>
                    <View style={styles.nameField}>
                        <Text style={styles.label}>Prénom</Text>
                        <View style={[styles.inputWrapper, errors.prenom && styles.inputError]}>
                            <UserRound size={18} color={OLIVE} />
                            <TextInput
                                style={styles.input}
                                placeholder="Votre Prénom"
                                placeholderTextColor="#aaa"
                                value={formData.prenom}
                                onChangeText={(val) => handleChange('prenom', val)}
                                autoCapitalize="words"
                            />
                        </View>
                        {errors.prenom && <Text style={styles.errorText}>{errors.prenom}</Text>}
                    </View>

                    <View style={styles.nameField}>
                        <Text style={styles.label}>Nom</Text>
                        <View style={[styles.inputWrapper, errors.nom && styles.inputError]}>
                            <UserRound size={18} color={OLIVE} />
                            <TextInput
                                style={styles.input}
                                placeholder="Votre Nom"
                                placeholderTextColor="#aaa"
                                value={formData.nom}
                                onChangeText={(val) => handleChange('nom', val)}
                                autoCapitalize="words"
                            />
                        </View>
                        {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
                    </View>
                </View>

                <Text style={styles.label}>Adresse e-mail</Text>
                <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                    <Mail size={18} color={OLIVE} />
                    <TextInput
                        style={styles.input}
                        placeholder="Exemple@email.com"
                        placeholderTextColor="#aaa"
                        value={formData.email}
                        onChangeText={(val) => handleChange('email', val)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <Text style={styles.label}>Mot de passe</Text>
                <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                    <Lock size={18} color={OLIVE} />
                    <TextInput
                        style={styles.input}
                        placeholder="•••••••••••••••"
                        placeholderTextColor="#aaa"
                        value={formData.password}
                        onChangeText={(val) => handleChange('password', val)}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                        {showPassword ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                    <Lock size={18} color={OLIVE} />
                    <TextInput
                        style={styles.input}
                        placeholder="•••••••••••••••"
                        placeholderTextColor="#aaa"
                        value={formData.confirmPassword}
                        onChangeText={(val) => handleChange('confirmPassword', val)}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                        {showPassword ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
                    </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                    <Text style={styles.loginButtonText}>Créer un compte</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={require('./../../assets/images/icons/google.png')} style={styles.icons} />
                        <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={require('./../../assets/images/icons/facebook.png')} style={styles.icons} />
                        <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Déjà un compte ? </Text>
                    <TouchableOpacity onPress={() => navigate('Login')}>
                        <Text style={styles.registerLink}>Se connecter</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </AuthLayout>
    );
}
// ─── Styles ───────────────────────────────────────────────────────────────────
const OLIVE = '#7a8c3f';
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f2f0',
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
    },
    icons: { width: 15, aspectRatio: 1 },
    logo: { width: width / 1.5, height: height / 10, marginBottom: 24 },
    title: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
    subtitle: { fontSize: 14, color: '#888', marginBottom: 36 },
    form: { width: '100%' },
    nameRow: { flexDirection: 'row', gap: 12 },
    nameField: { flex: 1 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 4 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 2,
        paddingHorizontal: 12,
        gap: 8,
    },
    input: { flex: 1, height: 48, fontSize: 14, color: '#333' },
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
    dividerLine: { flex: 1, height: 1, backgroundColor: '#ddd' },
    dividerText: { fontSize: 13, color: '#aaa' },
    socialRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
    socialButton: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 8, borderWidth: 1,
        borderColor: '#ddd', borderRadius: 10, height: 48, backgroundColor: '#fff',
    },
    socialText: { fontSize: 14, color: '#555' },
    registerRow: { flexDirection: 'row', justifyContent: 'center' },
    registerText: { fontSize: 13, color: '#888' },
    registerLink: { fontSize: 13, fontWeight: '700', color: '#333' },
    inputError: {
        borderColor: '#ff4d4d',
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 11,
        marginBottom: 8,
        marginLeft: 4,
    },
});
