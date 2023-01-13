import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SearchBar = () => {
    return (
        <View style={styles.container}>
            <FontAwesome name="search" size={17} color="black" />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>Search for...</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)'
    },
    button: {
        width: '90%',
        height: '100%',
        justifyContent: 'center',
        marginLeft: 10
    },
    text: {
        color: 'rgba(0, 0, 0, 0.35)',
        // transform: [{ translateY: -1 }]
    }
});