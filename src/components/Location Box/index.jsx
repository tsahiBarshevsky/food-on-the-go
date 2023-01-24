import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

const LocationBox = ({ city }) => {
    const { theme } = useContext(GlobalContext);

    return (
        <View style={[styles.container, styles[`container${theme}`]]}>
            <FontAwesome5 name="map-marker-alt" size={18} color="#f57c00" />
            <Text style={[styles.text, styles[`text${theme}`]]}>{city}</Text>
        </View>
    )
}

export default LocationBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        overflow: 'hidden',
    },
    containerLight: {
        backgroundColor: lightTheme.box,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.0125)'
    },
    containerDark: {
        backgroundColor: darkTheme.box,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.0925)'
    },
    text: {
        fontFamily: 'Quicksand',
        paddingLeft: 7,
        transform: [{ translateY: -1.5 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
});