import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FeedbackMessageProps {
    type: 'success' | 'error' | null;
    message: string | null;
}

export default function FeedbackMessage({ type, message }: FeedbackMessageProps) {
    if (!type || !message) return null;

    const isSuccess = type === 'success';

    return (
        <View style={[styles.container, isSuccess ? styles.successBg : styles.errorBg]}>
            <MaterialCommunityIcons
                name={isSuccess ? 'check-circle' : 'alert-circle'}
                size={20}
                color={isSuccess ? '#15803D' : '#B91C1C'}
            />
            <Text style={[styles.text, isSuccess ? styles.successText : styles.errorText]}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        width: '100%',
        gap: 8,
    },
    successBg: {
        backgroundColor: '#DCFCE7',
        borderColor: '#86EFAC',
        borderWidth: 1,
    },
    errorBg: {
        backgroundColor: '#FEE2E2',
        borderColor: '#FCA5A5',
        borderWidth: 1,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    successText: {
        color: '#15803D',
    },
    errorText: {
        color: '#B91C1C',
    },
});