import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { CARD_WIDTH } from '../../utils/constants';

const RestaurantCard = ({ index, restaurant }) => {
    const location = useSelector(state => state.location);
    const naviation = useNavigation();

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        if (d > 1) // More than km
            return `${d.toFixed(1)}km from you`;
        return `${(d * 1000).toFixed(1)}m from you`;
    }

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180)
    }

    return (
        <TouchableOpacity
            onPress={() => naviation.navigate('Restaurant', { index })}
            style={styles.container}
            activeOpacity={1}
        >
            <Image
                source={
                    typeof restaurant.image === 'string' ?
                        { uri: restaurant.image }
                        :
                        { uri: restaurant.image.url }
                }
                style={styles.image}
            />
            <View>
                <Text style={styles.title}>{restaurant.name}</Text>
                <Text>
                    {getDistanceFromLatLonInKm(
                        restaurant.location.latitude,
                        restaurant.location.longitude,
                        location.latitude,
                        location.longitude
                    )}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default RestaurantCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: CARD_WIDTH,
        backgroundColor: 'royalblue',
        borderRadius: 10,
        padding: 10,
        zIndex: 2,
        marginHorizontal: 10,
        overflow: 'hidden'
    },
    image: {
        width: 110,
        height: 110,
        resizeMode: 'cover',
        borderRadius: 5,
        marginRight: 10
    },
    title: {
        fontWeight: 'bold'
    }
});