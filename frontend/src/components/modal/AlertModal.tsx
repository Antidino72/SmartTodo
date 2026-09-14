import {BaseModal} from "@/src/components/modal/BaseModal";
import {Pressable, StyleSheet, Text, View} from "react-native"
interface AlertProps {
    visible : boolean,
    onClose : ()=> void,
    onConfirm? : ()=> void,
    Message : String,
    Title : string,
}

export function AlertModal({visible , onClose,Title,Message,onConfirm} : AlertProps) {
    return (
        <BaseModal visible={visible} onClose={onClose} title={Title}>
            <Text style={styles.message}>{Message}</Text>
            <View style={styles.actionRow}>
                <Pressable style={styles.okBtn} onPress={onConfirm}>
                    <Text style={styles.okText}>OK</Text>
                </Pressable>
            </View>
        </BaseModal>
    )
}
const styles = StyleSheet.create({
    message: { fontSize: 14, color: '#334155', marginBottom: 20 },

    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    okBtn: { backgroundColor: '#1562c5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    okText: { color: '#FFFFFF', fontWeight: '600' },
});