import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const SearchCard = ({ item }) => {
    const location = useSelector(state => state.location);
    const restaurants = useSelector(state => state.restaurants);
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
            return `${d.toFixed(1)}km`;
        return `${(d * 1000).toFixed(1)}m`;
    }

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180)
    }

    const onCardPressed = () => {
        const index = restaurants.findIndex((restaurant) => restaurant.id === item.id);
        naviation.navigate('Restaurant', { index });
    }

    return (
        <TouchableOpacity
            onPress={onCardPressed}
            style={styles.container}
            activeOpacity={1}
        >
            <View style={styles.details}>
                <View style={styles.locationBox}>
                    <View style={styles.location}>
                        <FontAwesome5 name="map-marker-alt" size={20} color="black" />
                    </View>
                    <Text>
                        {getDistanceFromLatLonInKm(
                            item.location.latitude,
                            item.location.longitude,
                            location.latitude,
                            location.longitude
                        )}
                    </Text>
                </View>
                <View>
                    <Text>{item.name}</Text>
                    <Text>{item.location.city}</Text>
                </View>
            </View>
            {item.type === 'Food Truck' ?
                <MaterialCommunityIcons name="truck-fast-outline" size={24} color="black" />
                :
                <Feather name="coffee" size={24} color="black" />
            }
        </TouchableOpacity>
    )
}

export default SearchCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingRight: 10,
        borderRadius: 10,
        backgroundColor: 'lightblue'
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgreen'
    },
    locationBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 55,
        marginRight: 5,
        backgroundColor: 'pink'
    },
    location: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: 17,
        marginBottom: 3,
        backgroundColor: 'grey'
    }
});