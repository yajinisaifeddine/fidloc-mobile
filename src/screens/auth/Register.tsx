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
import { useState } from 'react';
import {
    Eye, EyeOff, Lock, Mail, UserRound,

} from 'lucide-react-native';
import { useSignUp } from '../../hooks/auth/useSignUp';
import { log } from '../../lib/logger';
import { storage } from '../../lib/storage';
import { navigate } from '../../navigations/navigationRef';
const { width, height } = Dimensions.get('window');


export default function Register() {
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutate } = useSignUp();
    const handleSubmit = () => {
        const payload = {
            nom,
            prenom,
            email,
            password,
            confirmPassword,
            role: 'CLIENT',
        };

        log.info(payload);
        mutate(payload, {
            onSuccess: ({ data }) => {
                storage.set('id', data.id);
                storage.set('nom', nom);
                storage.set('prenom', prenom);
                storage.set('email', email);
                navigate("Verify")
            },
            onError: (err) => log.error(err.message),
        });
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled">

            <Image
                source={require('./../../assets/images/app-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez votre espace personnel</Text>

            <View style={styles.form}>

                {/* ── Prénom + Nom ── */}
                <View style={styles.nameRow}>
                    <View style={styles.nameField}>
                        <Text style={styles.label}>Prénom</Text>
                        <View style={styles.inputWrapper}>
                            <UserRound size={18} color={OLIVE} />
                            <TextInput
                                style={styles.input}
                                placeholder="Votre Prénom"
                                placeholderTextColor="#aaa"
                                value={prenom}
                                onChangeText={setPrenom}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    <View style={styles.nameField}>
                        <Text style={styles.label}>Nom</Text>
                        <View style={styles.inputWrapper}>
                            <UserRound size={18} color={OLIVE} />
                            <TextInput
                                style={styles.input}
                                placeholder="Votre Nom"
                                placeholderTextColor="#aaa"
                                value={nom}
                                onChangeText={setNom}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>
                </View>

                {/* ── Email ── */}
                <Text style={styles.label}>Adresse e-mail</Text>
                <View style={styles.inputWrapper}>
                    <Mail size={18} color={OLIVE} />
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



                {/* ── Mot de passe ── */}
                <Text style={styles.label}>Mot de passe</Text>
                <View style={styles.inputWrapper}>
                    <Lock size={18} color={OLIVE} />
                    <TextInput
                        style={styles.input}
                        placeholder="•••••••••••••••"
                        placeholderTextColor="#aaa"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                        {showPassword ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
                    </TouchableOpacity>
                </View>

                {/* ── Confirmer le mot de passe ── */}
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <View style={styles.inputWrapper}>
                    <Lock size={18} color={OLIVE} />
                    <TextInput
                        style={styles.input}
                        placeholder="•••••••••••••••"
                        placeholderTextColor="#aaa"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(p => !p)}>
                        {showConfirmPassword ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
                    </TouchableOpacity>
                </View>

                {/* ── Submit ── */}
                <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                    <Text style={styles.loginButtonText}>Créer un compte</Text>
                </TouchableOpacity>

                {/* ── Divider ── */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* ── Social ── */}
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

                {/* ── Login link ── */}
                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Déjà un compte ? </Text>
                    <TouchableOpacity onPress={() => navigate("Verify")} >
                        <Text style={styles.registerLink}>Se connecter</Text>
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
        marginBottom: 4,
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
});
