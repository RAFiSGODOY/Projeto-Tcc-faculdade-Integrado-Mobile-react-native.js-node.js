import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ progress }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.bar, { width: `${progress}%` }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 5,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginTop: 10,
    },
    bar: {
        height: '100%',
        backgroundColor: '#47C2B6',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
});

export default ProgressBar;
