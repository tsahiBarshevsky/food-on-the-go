import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

const SearchBar = () => {
    const { theme } = useContext(GlobalContext);
    const navigation = useNavigation();

    return (
        <View style={[styles.container, styles[`container${theme}`]]}>
            <FontAwesome name="search" size={17} color={theme === 'Light' ? 'black' : 'white'} />
            <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={styles.button}
            >
                <Text style={[styles.text, styles[`text${theme}`]]}>
                    Search for food truck or coffee cart...
                </Text>
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
        paddingHorizontal: 15,
        borderRadius: 25,
        borderWidth: 1
    },
    containerLight: {
        backgroundColor: lightTheme.box,
        borderColor: 'rgba(0, 0, 0, 0.0125)'
    },
    containerDark: {
        backgroundColor: darkTheme.box,
        borderColor: 'rgba(0, 0, 0, 0.0925)'
    },
    button: {
        width: '90%',
        height: '100%',
        justifyContent: 'center',
        marginLeft: 10
    },
    text: {
        fontFamily: 'Quicksand',
        transform: [{ translateY: -1.5 }]
    },
    textLight: {
        color: 'rgba(0, 0, 0, 0.35)',
    },
    textDark: {
        color: 'rgba(255, 255, 255, 0.35)',
    }
});