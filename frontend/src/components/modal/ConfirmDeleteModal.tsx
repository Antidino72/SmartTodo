import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BaseModal } from './BaseModal';

type ConfirmDeleteModalProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle?: string;
    titleCustom? : string;
};

export function ConfirmDeleteModal({ visible, onClose, onConfirm, taskTitle,titleCustom }: ConfirmDeleteModalProps) {
    return (
        <BaseModal visible={visible} onClose={onClose} title={titleCustom || "Supprimer la tâche"}>
            <Text style={styles.message}>
                Voulez-vous vraiment supprimer <Text style={styles.bold}>"{taskTitle}"</Text> ?
            </Text>

            <View style={styles.actionRow}>
                <Pressable style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelText}>Annuler</Text>
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={onConfirm}>
                    <Text style={styles.deleteText}>Supprimer</Text>
                </Pressable>
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    message: { fontSize: 14, color: '#334155', marginBottom: 20 },
    bold: { fontWeight: '700', color: '#0F172A' },
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
    cancelText: { color: '#64748B', fontWeight: '600' },
    deleteBtn: { backgroundColor: '#DC2626', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    deleteText: { color: '#FFFFFF', fontWeight: '600' },
});