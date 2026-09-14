import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { BaseModal } from './BaseModal';
import { PriorityLevel } from '../prioritySystem';
import { TaskStatus } from '../statusSysteme';
import { FontAwesome } from '@expo/vector-icons';
import { Task } from "@/src/constants/Task";

type EditTaskModalProps = {
    visible: boolean;
    onClose: () => void;
    onUpdateTask: (updatedTask: Task) => void;
    onDeleteRequest: () => void;
    task: Task | null;
};

const PRIORITY_OPTIONS: { id: PriorityLevel; label: string; icon: 'coffee' | 'clock-o' | 'fire'; activeColor: string }[] = [
    { id: 'low', label: 'Basse', icon: 'coffee', activeColor: '#475569' },
    { id: 'medium', label: 'Moyenne', icon: 'clock-o', activeColor: '#D97706' },
    { id: 'high', label: 'Haute', icon: 'fire', activeColor: '#DC2626' },
];

const STATUS_OPTIONS: { id: TaskStatus; label: string }[] = [
    { id: 'todo', label: 'À faire' },
    { id: 'in_progress', label: 'En cours' },
    { id: 'completed', label: 'Terminé' },
];

export function EditTaskModal({ visible, onClose, onUpdateTask, onDeleteRequest, task }: EditTaskModalProps) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState<PriorityLevel>('medium');
    const [status, setStatus] = useState<TaskStatus>('todo');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setCategory(task.category);
            setPriority(task.priority);
            setStatus(task.status);
        }
    }, [task, visible]);

    const handleSubmit = () => {
        if (!task || !title.trim()) return;

        onUpdateTask({
            id: task.id,
            title,
            category: category || 'Général',
            priority,
            status,
        });
        onClose();
    };

    return (
        <BaseModal visible={visible} onClose={onClose} title="Modifier la tâche">
            {/* Titre */}
            <Text style={styles.label}>Titre</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom de la tâche"
                placeholderTextColor="#94A3B8"
                value={title}
                onChangeText={setTitle}
            />

            {/* Catégorie */}
            <Text style={styles.label}>Nom catégorie</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: Backend, Design..."
                placeholderTextColor="#94A3B8"
                value={category}
                onChangeText={setCategory}
            />

            {/* Priorité */}
            <Text style={styles.label}>Priorité</Text>
            <View style={styles.row}>
                {PRIORITY_OPTIONS.map((opt) => {
                    const isSelected = priority === opt.id;
                    return (
                        <Pressable
                            key={opt.id}
                            onPress={() => setPriority(opt.id)}
                            style={[
                                styles.optionBtn,
                                isSelected && { borderColor: opt.activeColor, backgroundColor: opt.activeColor + '15' },
                            ]}
                        >
                            <FontAwesome
                                name={opt.icon}
                                size={13}
                                color={isSelected ? opt.activeColor : '#94A3B8'}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.optionText, isSelected && { color: opt.activeColor, fontWeight: '700' }]}>
                                {opt.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* État / Statut */}
            <Text style={styles.label}>État</Text>
            <View style={styles.row}>
                {STATUS_OPTIONS.map((opt) => {
                    const isSelected = status === opt.id;
                    return (
                        <Pressable
                            key={opt.id}
                            onPress={() => setStatus(opt.id)}
                            style={[
                                styles.optionBtn,
                                isSelected && { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
                            ]}
                        >
                            <Text style={[styles.optionText, isSelected && { color: '#2563EB', fontWeight: '700' }]}>
                                {opt.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Boutons d'actions */}
            <View style={styles.actionRow}>
                <Pressable style={styles.deleteIconBtn} onPress={onDeleteRequest}>
                    <FontAwesome name="trash" size={16} color="#DC2626" />
                </Pressable>

                <View style={styles.rightActions}>
                    <Pressable style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.cancelText}>Annuler</Text>
                    </Pressable>
                    <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Enregistrer</Text>
                    </Pressable>
                </View>
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    label: { fontSize: 13, fontWeight: '600', color: '#475569', marginTop: 12, marginBottom: 4 },
    input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: '#0F172A' },
    row: { flexDirection: 'row', gap: 8 },
    optionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8 },
    optionText: { fontSize: 12, color: '#64748B' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
    rightActions: { flexDirection: 'row', gap: 8 },
    deleteIconBtn: { padding: 10, borderRadius: 8, backgroundColor: '#FEE2E2' },
    cancelBtn: { paddingHorizontal: 14, paddingVertical: 10 },
    cancelText: { color: '#64748B', fontWeight: '600' },
    submitBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    submitText: { color: '#FFFFFF', fontWeight: '600' },
});