import { BaseModal } from "@/src/components/modal/BaseModal";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import * as Clipboard from 'expo-clipboard';
import { FontAwesome } from "@expo/vector-icons";
import {UserCard} from "@/src/components/UserCard";

type ProfilModalProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: (updatedData: { name: string; email: string; image: string }) => void;
};

export function ProfilModal({ visible, onClose, onConfirm }: ProfilModalProps) {
    const { user } = useAuth();

    // États locaux pour tous les champs modifiables
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");

    // Initialisation des valeurs à l'ouverture du modal
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setImage(user.image || "");
        }
    }, [user, visible]);

    // Fonction pour copier l'ID
    const copyToClipboard = async (id: string) => {
        await Clipboard.setStringAsync(id);
        Alert.alert("Copié !", "ID utilisateur copié dans le presse-papier.");
    };


    return (
        <BaseModal visible={visible} onClose={onClose} title="Profil">
            <View style={styles.container}>
                {user ? (
                    <>
                        {/* Section Image + Input pour changer le lien de l'image */}
                        <View style={styles.imageContainer}>
                            <UserCard image={image} name={name} email={user.email} id={user.id}/>
                        </View>

                        <Text style={styles.label}>URL de l'image de profil :</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setImage}
                            placeholder={image}
                            placeholderTextColor="#94a3b8"
                        />

                        <Text style={styles.label}>Nom :</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setName}
                            placeholder={name}
                            placeholderTextColor="#94a3b8"
                        />

                        <Text style={styles.label}>Email :</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Entrez votre email"
                            placeholderTextColor="#94a3b8"
                        />

                        {/* ID en petit, gris, avec bouton copier */}
                        <View style={styles.idContainer}>
                            <Text style={styles.idText} numberOfLines={1} ellipsizeMode="middle">
                                ID: {user.id}
                            </Text>
                            <TouchableOpacity
                                style={styles.copyButton}
                                onPress={() => copyToClipboard(user.id)}
                            >
                                <FontAwesome name="copy" size={14} color="#64748b" />
                                <Text style={styles.copyButtonText}>Copier</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Bouton de sauvegarde */}
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() =>{

                                onConfirm({ name, email, image })
                                onClose()
                        }}
                        >
                            <Text style={styles.saveButtonText}>Enregistrer</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text style={styles.value}>Aucune information utilisateur disponible.</Text>
                )}
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 6,
    },
    imageContainer: {
        alignItems: 'center',
        borderWidth :2,
        borderRadius : 30,
        backgroundColor :  "#b5b5b5",
        padding : 10,
        marginVertical : 2,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#64748b',
        marginTop: 4,
    },
    value: {
        fontSize: 14,
        color: '#0f172a',
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 15,
        color: '#0f172a',
        backgroundColor: '#f8fafc',
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginTop: 6,
    },
    idText: {
        fontSize: 11,
        color: '#94a3b8',
        flex: 1,
        marginRight: 10,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#e2e8f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    copyButtonText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#4f6dea',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
});