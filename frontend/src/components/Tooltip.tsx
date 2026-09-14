import React, {ReactNode, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

interface TooltipProps {
    text : String,
    children : ReactNode
}

export default function Tooltip({ text, children } : TooltipProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <Pressable
            style={styles.wrapper}
            onPointerEnter={()=> setShowTooltip(true)}
            onPointerLeave={() => setShowTooltip(false)}
            onPressIn={()=> setShowTooltip(true)}
            onPressOut={()=> setShowTooltip(false)}
        >
            {/* Affiche n'importe quel composant enfant que tu lui passes */}
            {children}

            {/* Affiche la bulle si le survol est actif */}
            {showTooltip && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>{text}</Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        alignSelf: 'flex-start',
    },
    tooltip: {
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: [{ translateX: '-50%' }],
        marginBottom: 6,
        backgroundColor: '#1E293B',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        zIndex: 10,
    },
    tooltipText: {
        color: '#FFFFFF',
        fontSize: 12,
    }
});