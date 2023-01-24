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
    }
});

export default globalStyles;