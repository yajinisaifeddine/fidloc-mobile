// components/ui/FieldError.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { log } from '../lib/logger';

interface Props {
    message?: string;
}

const FieldError = ({ message }: Props) => {
    log.debug("error message", message)
    if (!message || message === "Network Error") return null;
    return <Text style={styles.error}>{message}</Text>;
};

const styles = StyleSheet.create({
    error: {
        fontSize: 12,
        color: '#c0392b',
        marginBottom: 10,
        marginLeft: 4,
    },
});

export default FieldError;
