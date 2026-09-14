import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Share, Platform} from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

type UserCardProps = {
    image: string;
    name: string;
    email: string;
    id: string;
    onEditPress?: () => void; // Optionnel : pour ouvrir ton modal de modification par exemple
};

export function UserCard({ image, name, email, id, onEditPress }: UserCardProps) {
    // Animation de rebond subtile au clic sur la carte
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(id);
        alert("ID copié dans le presse-papier !");
    };

    return (
        <Animated.View
            entering={FadeInDown.duration(600).springify()} // Animation d'apparition fluide du bas vers le haut
            style={[styles.cardContainer, animatedStyle]}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onEditPress}
                style={styles.cardContent}
            >
                {/* En-tête de la carte avec l'avatar et les infos principales */}
                <View style={styles.headerRow}>
                    <Image
                        source={{ uri: image || "https://lh3.googleusercontent.com/a/default-user=s96-c" }}
                        placeholder={{ uri: "https://lh3.googleusercontent.com/a/default-user=s96-c" }}
                        style={styles.avatar}
                        contentFit="cover"
                        transition={500}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.name} numberOfLines={1}>{name || "Utilisateur"}</Text>
                        <Text style={styles.email} numberOfLines={1}>{email || "email@example.com"}</Text>
                    </View>

                    {/* Petite icône d'édition si l'action est transmise */}
                    {onEditPress && (
                        <View style={styles.editBadge}>
                            <FontAwesome name="pencil" size={14} color="#4f6dea" />
                        </View>
                    )}
                </View>

                {/* Section ID discrète avec bouton de copie rapide */}
                <View style={styles.footerRow}>
                    <Text style={styles.idText} numberOfLines={1} ellipsizeMode="middle">
                        ID: {id}
                    </Text>
                    <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                        <FontAwesome name="copy" size={12} color="#64748b" />
                        <Text style={styles.copyButtonText}>Copier l'ID</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginVertical: 8,
    },
    cardContent: {
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#f1f5f9',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 2,
    },
    email: {
        fontSize: 14,
        color: '#64748b',
    },
    editBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f8fafc',
    },
    idText: {
        fontSize: 11,
        color: '#94a3b8',
        flex: 1,
        marginRight: 10,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#f8fafc',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    copyButtonText: {
        fontSize: 11,
        color: '#475569',
        fontWeight: '600',
    },
});