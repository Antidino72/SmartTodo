import React, { ComponentProps } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// 1. Type strict pour les statuts
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

type FontAwesomeName = ComponentProps<typeof FontAwesome>['name'];

interface StatusConfig {
    label: string;
    icon: FontAwesomeName;
    color: string;
    bgColor: string;
    borderColor: string;
}

// 2. Configuration centralisée
const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
    todo: {
        label: 'À faire',
        icon: 'circle-o',
        color: '#0284C7',
        bgColor: '#addffd',
        borderColor: '#173897',
    },
    in_progress: {
        label: 'En cours',
        icon: 'spinner',
        color: '#D97706',
        bgColor: '#FEF3C7',
        borderColor: '#8e7400',
    },
    completed: {
        label: 'Terminé',
        icon: 'check-circle',   // Coché
        color: '#166534',       // Vert texte
        bgColor: '#b9ffd5',     // Vert fond
        borderColor: '#005922', // Vert bordure
    },
};

interface StatusBadgeProps {
    status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo;

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: config.bgColor,
                    borderColor: config.borderColor,
                },
            ]}
        >
            <FontAwesome
                name={config.icon}
                size={12}
                color={config.color}
                style={styles.icon}
            />
            <Text style={[styles.text, { color: config.color }]}>
                {config.label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    icon: {
        marginRight: 6,
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
    },
});