import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const LocationBox = ({ street }) => {
    return (
        <View style={styles.container}>
            <FontAwesome5 name="map-marker-alt" size={18} color="black" />
            <Text style={styles.text}>{street}</Text>
        </View>
    )
}

export default LocationBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'absolute',
        top: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 5,
        left: 15,
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)'
    },
    text: {
        paddingLeft: 7,
        transform: [{ translateY: -1 }]
    }
});