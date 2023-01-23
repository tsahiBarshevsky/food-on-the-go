import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BUTTON_SIZE = 23;

const Checkbox = ({ checked, setChecked, caption, withCaption }) => {
    return withCaption ? (
        <TouchableOpacity
            onPress={() => setChecked(!checked)}
            style={styles.container}
            activeOpacity={1}
        >
            <TouchableOpacity
                onPress={() => setChecked(!checked)}
                style={styles.button}
            >
                {checked && <View style={styles.inner} />}
            </TouchableOpacity>
            <Text style={styles.cpation}>{caption}</Text>
        </TouchableOpacity>
    ) : (
        <TouchableOpacity
            onPress={() => setChecked(!checked)}
            style={[styles.button, styles.noCpation]}
        >
            {checked && <View style={styles.inner} />}
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
        paddingVertical: 5,
        backgroundColor: 'royalblue'
    },
    button: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inner: {
        width: BUTTON_SIZE - 8,
        height: BUTTON_SIZE - 8,
        borderRadius: (BUTTON_SIZE - 8) / 2,
        backgroundColor: 'black'
    },
    noCpation: {
        marginVertical: 5
    },
    cpation: {
        paddingLeft: 10,
        transform: [{ translateY: -1 }]
    }
});