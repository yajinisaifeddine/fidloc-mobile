import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput,
} from 'react-native';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigations/types';
import { NewPasswordSchema } from '../../types';
import { log } from '../../lib/logger';
import { useFinalizeReset } from '../../hooks/auth/useAuthenticate';
import { navigate } from '../../navigations/navigationRef';
import AuthLayout from '../../layout/AuthLayout';

const { width, height } = Dimensions.get('window');
const OLIVE = '#7a8c3f';
type VerifyRouteProp = RouteProp<RootStackParamList, 'NewPassword'>;

const NewPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const route = useRoute<VerifyRouteProp>()
    const { mutate } = useFinalizeReset()
    const { email, token } = route.params

    const handleSubmit = () => {
        const payload = { password, confirmPassword }
        const result = NewPasswordSchema.safeParse(payload)
        if (result.error) {
            log.error(result.error)
        }
        mutate({ password, email, token }, {
            onSuccess: () => navigate("Login"),
            onError: (e) => log.error(e)
        })

    }
    return (
        <AuthLayout
            title='Nouveau mot de passe'
            subTitle='  Choisissez un mot de passe sécurisé pour protéger votre compte'
        >
            <View style={styles.form}>
                <Text style={styles.label}>Mot de passe</Text>
                <View style={styles.inputWrapper}>
                    <Lock size={18} color={OLIVE} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="•••••••••••••••"
                        placeholderTextColor="#aaa"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                        {showPassword
                            ? <EyeOff size={18} color="#aaa" />
                            : <Eye size={18} color="#aaa" />
                        }
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <View style={styles.inputWrapper}>
                    <Lock size={18} color={OLIVE} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="•••••••••••••••"
                        placeholderTextColor="#aaa"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                        {showPassword
                            ? <EyeOff size={18} color="#aaa" />
                            : <Eye size={18} color="#aaa" />
                        }
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Confirmer</Text>
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
        marginBottom: 16,
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
