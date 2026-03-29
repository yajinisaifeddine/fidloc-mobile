import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useState, } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { log } from '../../lib/logger';
import { useLogin } from '../../hooks/useLogin';
import { useNavigate } from '../../hooks/useNavigate';
import ThemedText from '../../components/ui/ThemedText';





const { width, height } = Dimensions.get("window")


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth()
    const { mutate } = useLogin()
    const navigation = useNavigate()


    const handleSubmi = (e: React.SubmitEvent) => {
        e.preventDefault()
        const payload = { email, password }
        log.info(payload)
        mutate(payload, {
            onSuccess: (data) => {
                login(data.data.accessToken, data.data.refreshToken)
            },
            onError: (err) => log.error(err.message)

        })
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled">

            {/* Logo */}
            <Image
                source={require('./../../assets/images/app-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Header */}
            <ThemedText style={styles.title}>Bienvenue !</ThemedText >
            <Text style={styles.subtitle}>Connectez vous à votre espace personnel</Text>

            {/* Form */}
            <View style={styles.form}>

                {/* Email */}
                <Text style={styles.label}>Adresse e-mail</Text>
                <View style={styles.inputWrapper}>
                    <User size={18} />
                    <TextInput
                        style={styles.input}
                        placeholder="Exemple@email.com"
                        placeholderTextColor="#aaa"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Password */}
                <Text style={styles.label}>Mot de passe</Text>
                <View style={styles.inputWrapper}>
                    <Lock size={18} />
                    <TextInput
                        style={styles.input}
                        placeholder="•••••••••••••••"
                        placeholderTextColor="#aaa"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                        {showPassword ? <EyeOff size={18} /> :
                            <Eye size={18} />
                        }

                    </TouchableOpacity>
                </View>

                {/* Remember me + Forgot password */}
                <View style={styles.row}>

                    <TouchableOpacity>
                        <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>
                </View>

                {/* Login button */}
                <TouchableOpacity style={styles.loginButton} onPress={handleSubmi}>
                    <Text style={styles.loginButtonText}>Se Connecter</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social buttons */}
                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialButton}>

                        <Image source={require("./../../assets/images/icons/google.png")} style={styles.icons} />
                        <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={require("./../../assets/images/icons/facebook.png")} style={styles.icons} />
                        <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>
                </View>

                {/* Register */}
                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Pas encore de compte ? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('sign-up')}>
                        <Text style={styles.registerLink}>Créer un compte</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
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
    icons: {
        width: 15,
        aspectRatio: 1
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

    // ── Inputs ──
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
        marginBottom: 16,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 14,
        color: '#333',
    },

    // ── Remember / Forgot ──
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: OLIVE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: OLIVE,
        borderColor: OLIVE,
    },
    rememberText: {
        fontSize: 13,
        color: '#555',
    },
    forgotText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
    },

    // ── Login button ──
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

    // ── Divider ──
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

    // ── Social ──
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

    // ── Register ──
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
