import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SearchBar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <FontAwesome name="search" size={17} color="black" />
            <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={styles.button}
            >
                <Text style={styles.text}>Search food truck or coffee cart...</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        borderRadius: 25,
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