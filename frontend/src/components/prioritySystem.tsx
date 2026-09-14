import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {FontAwesome} from "@expo/vector-icons";

// Types pour sécuriser les 3 états
export type PriorityLevel = 'low' | 'medium' | 'high';

interface PriorityBadgeProps {
    level: PriorityLevel;
}

// Configuration des styles et icônes par état
const PRIORITY_CONFIG = {
    high: {
        label: 'Haute',
        icon: "warning" as const,
        color: '#991B1B',       // Rouge texte
        bgColor: '#FEE2E2',     // Rouge fond
        borderColor: '#FCA5A5', // Rouge bordure
    },
    medium: {
        label: 'Moyenne',
        icon: "clock-o" as const,
        color: '#9A3412',       // Orange texte
        bgColor: '#FFEDD5',     // Orange fond
        borderColor: '#FDBA74', // Orange bordure
    },
    low: {
        label: 'Basse',
        icon: "coffee" as const,
        color: '#178100',       // Slate/Gris texte
        bgColor: '#adffa4',     // Slate/Gris fond
        borderColor: '#027e02', // Slate/Gris bordure
    },
};

export function PriorityBadge({ level }: PriorityBadgeProps) {
    const config = PRIORITY_CONFIG[level] || PRIORITY_CONFIG.low;


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
            <FontAwesome name={config.icon}
                         size={12}
                         color="black"/>
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
        marginRight: 4,
    },
    text: {
        fontSize: 12,
        marginLeft : 5,
        fontWeight: '600',
    },
});