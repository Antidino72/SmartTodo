import React, { ReactNode } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type BaseModalProps = {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode; // Le contenu spécifique de la pop-up
};

export function BaseModal({ visible, onClose, title, children }: BaseModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    {/* Header générique avec titre et bouton fermer */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <Pressable onPress={onClose} hitSlop={8}>
                            <FontAwesome name="times" size={18} color="#64748B" />
                        </Pressable>
                    </View>

                    {/* Injection du contenu du formulaire ou message */}
                    <View style={styles.content}>{children}</View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: '90%',
        maxWidth: 480,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        ...Platform.select({
            web: {
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    content: {
        width: '100%',
    },
});