import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BUTTON_SIZE = 40;

const FilterButton = () => {
    return (
        <TouchableOpacity style={styles.container}>
            <MaterialCommunityIcons name="tune-variant" size={24} color="black" />
        </TouchableOpacity>
    )
}

export default FilterButton

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: BUTTON_SIZE / 2,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
    }
});