import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

const BUTTON_SIZE = 20;

const Checkbox = ({ checked, setChecked, caption, withCaption }) => {
    const { theme } = useContext(GlobalContext);

    return withCaption ? (
        <TouchableOpacity
            onPress={() => setChecked(!checked)}
            style={styles.container}
            activeOpacity={1}
        >
            <TouchableOpacity
                onPress={() => setChecked(!checked)}
                style={[styles.button, styles[`button${theme}`]]}
            >
                {checked && <View style={[styles.inner, styles[`inner${theme}`]]} />}
            </TouchableOpacity>
            <Text style={[styles.caption, styles[`caption${theme}`]]}>{caption}</Text>
        </TouchableOpacity>
    ) : (
        <TouchableOpacity
            onPress={() => setChecked(!checked)}
            style={[styles.button, styles[`button${theme}`], styles.noCpation]}
        >
            {checked && <View style={[styles.inner, styles[`inner${theme}`]]} />}
        </TouchableOpacity>
    )
}

export default Checkbox;

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 5
    },
    button: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonLight: {
        borderColor: 'black'
    },
    buttonDark: {
        borderColor: 'white'
    },
    inner: {
        width: BUTTON_SIZE - 8,
        height: BUTTON_SIZE - 8,
        borderRadius: (BUTTON_SIZE - 8) / 2,
    },
    innerLight: {
        backgroundColor: 'black'
    },
    innerDark: {
        backgroundColor: 'white'
    },
    noCpation: {
        marginVertical: 5
    },
    caption: {
        fontFamily: 'Quicksand',
        paddingLeft: 10,
        transform: [{ translateY: -1.5 }]
    },
    captionLight: {
        color: lightTheme.text
    },
    captionDark: {
        color: darkTheme.text
    }
});