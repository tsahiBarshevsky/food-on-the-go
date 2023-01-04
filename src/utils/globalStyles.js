import { StyleSheet, Platform, StatusBar } from 'react-native';

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
});

export default globalStyles;