import {View, Text, TextInput, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import "@/src/components/style/css/auth.css"
import { router } from "expo-router";
import FeedbackMessage from "@/src/components/FeedbackMessage";
import { authClient } from '@/lib/auth_client';
import {useAuth} from "@/src/context/AuthContext";

interface AuthScreenProps {
    mode: "login" | "register";
}


export  function AuthScreen({ mode }: AuthScreenProps) {
    const isLogin = mode === 'login';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');


    const [showPassword, setShowPassword] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const { refreshSession }  = useAuth();
    const handleLogin = async () => {
        try {
            const {data, error} = await authClient.signIn.email({
                email,
                password,
                rememberMe : true,
            })

            const { data: session } = await authClient.getSession()
            console.log(session);
            if (data) {
                setFeedback({ type: 'success', message: 'Connexion réussie !' });
                refreshSession();
                setTimeout(() => router.push('/home'), 1000);
            } else {
                setFeedback({ type: 'error', message: error.message || 'Identifiants incorrects.' });
            }
        } catch (e) {
            setFeedback({ type: 'error', message: 'Impossible de joindre le serveur.' });
        }
    };

    const handleRegister = async () => {
        try {

            const {data , error} = await authClient.signUp.email({
                email,
                password,
                name : name,
            });


            if (data) {
                setFeedback({ type: 'success', message: 'Connexion réussie !' });
                await refreshSession()
                router.push('/home');
            } else {
                setFeedback({ type: 'error', message: error.message || 'Champs incorrect' });
            }
        } catch (e) {
            setFeedback({ type: 'error', message: 'Impossible de joindre le serveur.' });
        }
    };

    return (
        <View style={styles.form}>
            <View style={styles.container}>
                <Text style={styles.title}>
                    {isLogin ? "Connexion" : "Inscription"}
                </Text>
                {!isLogin && (
                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="account-outline" size={20} color="#aaa" />
                        <TextInput
                            style={styles.input}
                            placeholder="Pseudo"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>
                )}
                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="email" size={20} color="#aaa" />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="lock-outline" size={20} color="#aaa" />
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <MaterialCommunityIcons
                            name={showPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#aaa"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={{ marginBottom: 26 }}
                    onPress={() => {
                        if (isLogin) {
                            router.push('/auth/register');
                        } else {
                            router.push('/auth/login');
                        }
                    }}>
                    <Text style={styles.link}>
                        {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
                    </Text>
                </TouchableOpacity>

                <FeedbackMessage type={feedback?.type ?? null} message={feedback?.message ?? null} />
                <TouchableOpacity
                    style={styles.button}
                    onPress={isLogin ? handleLogin : handleRegister}
                >
                    <Text style={styles.buttonText}>
                        {isLogin ? "Se connecter" : "S'inscrire"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    link: {
        color: '#7C6FE0',
        textAlign: 'center',
        marginTop: 36,
        fontSize: 14,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F5',
        borderColor: '#606060',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 25,
        width: "75%",
        cursor : "pointer"
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#381470FF',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 20,
        width: Platform.OS === "web" ? '40%' : "100%",
        boxShadow : "0px 16px 40px #311443",
        elevation: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 60,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        padding: 14,
        fontSize: 16,
        cursor : "pointer"
    },
    button: {
        width: '100%',
        backgroundColor: '#4F46E5',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});