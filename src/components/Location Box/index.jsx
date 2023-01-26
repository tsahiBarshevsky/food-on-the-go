import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

const LocationBox = ({ city, mapRef }) => {
    const { theme } = useContext(GlobalContext);
    const location = useSelector(state => state.location);

    const showUserLocation = () => {
        mapRef.current?.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        });
    }

    return (
        <TouchableOpacity
            onPress={showUserLocation}
            style={[styles.container, styles[`container${theme}`]]}
            activeOpacity={1}
        >
            <FontAwesome5 name="map-marker-alt" size={18} color="#f57c00" />
            <Text style={[styles.text, styles[`text${theme}`]]}>{city}</Text>
        </TouchableOpacity>
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
        alignSelf: 'flex-start'
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