import { StyleSheet, Platform, StatusBar } from 'react-native';
import { lightTheme, darkTheme } from './themes';

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    menu: {
        borderRadius: 10
    },
    menuLight: {
        backgroundColor: lightTheme.bottomBar
    },
    menuDark: {
        backgroundColor: darkTheme.bottomBar
    },
    textInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    textInputWrapperLight: {
        backgroundColor: lightTheme.box
    },
    textInputWrapperDark: {
        backgroundColor: darkTheme.box
    },
    textInput: {
        flex: 1,
        fontFamily: 'Quicksand'
    },
    textInputLight: {
        color: lightTheme.text
    },
    textInputDark: {
        color: darkTheme.text
    }
});

export default globalStyles;