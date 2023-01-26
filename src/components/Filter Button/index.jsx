import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

const BUTTON_SIZE = 40;

const FilterButton = ({ bottomSheetRef }) => {
    const { theme } = useContext(GlobalContext);

    return (
        <TouchableOpacity
            onPress={() => bottomSheetRef.current?.open()}
            style={[styles.container, styles[`container${theme}`]]}
            activeOpacity={0.85}
        >
            <MaterialCommunityIcons
                name="tune-variant"
                size={22}
                color={theme === 'Light' ? 'black' : 'white'}
            />
        </TouchableOpacity>
    )
}

export default FilterButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BUTTON_SIZE / 2,
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
});