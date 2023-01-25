import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';

const StatBox = ({ caption, value }) => {
    const { theme } = useContext(GlobalContext);

    return (
        <View style={styles.statBox}>
            <Text style={[styles.text, styles.value]}>{value}</Text>
            <Text style={[styles.text, styles[`text${theme}`]]}>{caption}</Text>
        </View>
    )
}

export default StatBox;

const styles = StyleSheet.create({
    statBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '33.3%'
    },
    text: {
        fontFamily: 'Quicksand',
        transform: [{ translateY: -1.5 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    value: {
        fontSize: 25,
        fontFamily: 'QuicksandBold',
        color: lightTheme.icon
    }
});