import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { BaseModal } from './BaseModal';
import { PriorityLevel } from '../prioritySystem';
import { FontAwesome } from '@expo/vector-icons';
import { Task } from "@/src/constants/Task"

type AddTaskModalProps = {
    visible: boolean;
    onClose: () => void;
    onSaveTask: (task: {
        id: string | number;
        title: string;
        category: string;
        priority: "low" | "medium" | "high";
        status: "todo" | "in_progress" | "completed";
    }) => void;
    initialData?: Task | null;
};

const PRIORITY_OPTIONS: { id: PriorityLevel; label: string; icon: 'coffee' | 'clock-o' | 'fire'; activeColor: string }[] = [
    { id: 'low', label: 'Basse', icon: 'coffee', activeColor: '#475569' },
    { id: 'medium', label: 'Moyenne', icon: 'clock-o', activeColor: '#D97706' },
    { id: 'high', label: 'Haute', icon: 'fire', activeColor: '#DC2626' },
];

export function AddTaskModal({ visible, onClose, onSaveTask, initialData }: AddTaskModalProps) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState<PriorityLevel>('medium');


    useEffect(() => {
        if (visible && initialData) {
            setTitle(initialData.title ?? '');
            setCategory(initialData.category ?? '');
            setPriority(initialData.priority ?? 'medium');
        } else if (visible && !initialData) {
            // ← reset propre pour une nouvelle tâche
            setTitle('');
            setCategory('');
            setPriority('medium');
        }
    }, [visible, initialData]);

    const handleSubmit = () => {
        if (!title.trim()) return;

        onSaveTask({
            id: initialData?.id ?? Date.now().toString(),
            title: title.trim(),
            category: category.trim(),
            priority,
            status: initialData?.status ?? 'todo',
        });

        onClose();
    };

    const isEditing = Boolean(initialData);

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            title={isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
        >
            <Text style={styles.label}>Titre</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: Valider la doc API"
                placeholderTextColor="#94A3B8"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Catégorie</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: Backend"
                placeholderTextColor="#94A3B8"
                value={category}
                onChangeText={setCategory}
            />

            <Text style={styles.label}>Priorité</Text>
            <View style={styles.priorityRow}>
                {PRIORITY_OPTIONS.map((opt) => {
                    const isSelected = priority === opt.id;
                    return (
                        <Pressable
                            key={opt.id}
                            onPress={() => setPriority(opt.id)}
                            style={[
                                styles.priorityOption,
                                isSelected && { borderColor: opt.activeColor, backgroundColor: opt.activeColor + '15' },
                            ]}
                        >
                            <FontAwesome
                                name={opt.icon}
                                size={14}
                                color={isSelected ? opt.activeColor : '#94A3B8'}
                                style={styles.optionIcon}
                            />
                            <Text style={[styles.priorityText, isSelected && { color: opt.activeColor, fontWeight: '700' }]}>
                                {opt.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <View style={styles.actionRow}>
                <Pressable style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelText}>Annuler</Text>
                </Pressable>
                <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitText}>{isEditing ? 'Enregistrer' : 'Ajouter'}</Text>
                </Pressable>
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    label: { fontSize: 14, fontWeight: '600', color: '#475569', marginTop: 12, marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A' },
    priorityRow: { flexDirection: 'row', gap: 8 },
    priorityOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8 },
    optionIcon: { marginRight: 6 },
    priorityText: { fontSize: 13, fontWeight: '500', color: '#64748B' },
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
    cancelBtn: { paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'center' },
    cancelText: { color: '#64748B', fontWeight: '600' },
    submitBtn: { backgroundColor: '#2563EB', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8, justifyContent: 'center' },
    submitText: { color: '#FFFFFF', fontWeight: '600' },
});