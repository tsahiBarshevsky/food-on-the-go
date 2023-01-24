import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';

const FilterApplyButton = ({ caption, value, onPress }) => {
    const { theme } = useContext(GlobalContext);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={[
                styles.button,
                value && styles[`selected${theme}`]
            ]}
        >
            <Text
                style={[
                    styles.text,
                    styles[`text${theme}`],
                    value && styles[`selectedText${theme}`]
                ]}
            >
                {caption}
            </Text>
        </TouchableOpacity>
    )
}

export default FilterApplyButton;

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#5f6266',
        marginBottom: 10,
        marginRight: 10
    },
    selectedLight: {
        borderColor: lightTheme.icon,
        backgroundColor: '#d3e1f8'
    },
    selectedDark: {
        borderColor: darkTheme.icon,
        backgroundColor: '#394456'
    },
    selectedTextLight: {
        color: lightTheme.icon
    },
    selectedTextDark: {
        color: darkTheme.icon
    },
    text: {
        fontSize: 12,
        fontFamily: 'Quicksand',
        transform: [{ translateY: -1.5 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    }
});