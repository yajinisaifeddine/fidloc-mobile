// components/PickerSelect.tsx

import {
    View, Text, TouchableOpacity, Modal,
    FlatList, TouchableWithoutFeedback, StyleSheet,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';

export interface PickerOption {
    label: string;
    value: string;
}

interface Props {
    placeholder?: string;
    value: string | null;
    items: PickerOption[];
    onValueChange: (value: string) => void;
}

import { useState } from 'react';

export default function PickerSelect({ placeholder = 'Sélectionner...', value, items, onValueChange }: Props) {
    const [visible, setVisible] = useState(false);

    const selectedLabel = items.find(i => i.value === value)?.label;

    return (
        <View>
            {/* Trigger */}
            <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)} activeOpacity={0.7}>
                <Text style={[styles.triggerText, !selectedLabel && styles.placeholder]}>
                    {selectedLabel ?? placeholder}
                </Text>
                <ChevronDown size={16} color="#aaa" />
            </TouchableOpacity>

            {/* Modal */}
            <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
                {/* Backdrop — tapping outside closes */}
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                {/* Sheet */}
                <View style={styles.sheet} pointerEvents="box-none">
                    <View style={styles.sheetInner}>

                        {/* Handle */}
                        <View style={styles.handle} />

                        {/* Options */}
                        <FlatList
                            data={items}
                            keyExtractor={item => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.option, item.value === value && styles.optionSelected]}
                                    onPress={() => { onValueChange(item.value); setVisible(false); }}
                                    activeOpacity={0.7}>
                                    <Text style={[styles.optionText, item.value === value && styles.optionTextSelected]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />

                        {/* Cancel */}
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setVisible(false)} activeOpacity={0.7}>
                            <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );
}

const OLIVE = '#7a8c3f';

const styles = StyleSheet.create({
    // ── Trigger ──
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 4,
        gap: 8,
    },
    triggerText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    placeholder: {
        color: '#aaa',
    },

    // ── Modal ──
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    sheet: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
    },
    sheetInner: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
        paddingBottom: 32,
        paddingHorizontal: 16,
        maxHeight: '60%',
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ddd',
        alignSelf: 'center',
        marginBottom: 16,
    },

    // ── Options ──
    option: {
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    optionSelected: {
        backgroundColor: `${OLIVE}15`,
    },
    optionText: {
        fontSize: 15,
        color: '#333',
    },
    optionTextSelected: {
        color: OLIVE,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },

    // ── Cancel ──
    cancelButton: {
        marginTop: 8,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
    },
    cancelText: {
        fontSize: 15,
        color: '#888',
        fontWeight: '500',
    },
});
