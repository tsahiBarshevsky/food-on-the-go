import React, { useEffect, useState, useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { FontAwesome5, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { CARD_WIDTH } from '../../utils/constants';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

const RestaurantCard = ({ restaurant }) => {
    const { theme, triggerFilter } = useContext(GlobalContext);
    const [ratingAverage, setRatingAverage] = useState(0);
    const restaurants = useSelector(state => state.restaurants);
    const location = useSelector(state => state.location);
    const naviation = useNavigation();

    const onCardPressed = () => {
        const index = restaurants.findIndex((item) => item.id === restaurant.id);
        naviation.navigate('Restaurant', { index });
    }

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
        return deg * (Math.PI / 180);
    }

    useEffect(() => {
        const ratings = restaurant.reviews.map(({ rating }) => rating + 1);
        if (ratings.length > 0) {
            const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
            setRatingAverage(average.toFixed(1));
        }
    }, [triggerFilter]);

    return (
        <TouchableOpacity
            onPress={() => onCardPressed()}
            style={[styles.container, styles[`container${theme}`]]}
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
            <View style={{ flex: 1 }}>
                <Text style={[styles.title, styles[`text${theme}`]]}>{restaurant.name}</Text>
                <View style={styles.data}>
                    <View style={styles.icon}>
                        <FontAwesome5 name="map-marker-alt" size={16} color="#f57c00" />
                    </View>
                    <Text style={[styles.text, styles[`text${theme}`]]}>
                        {restaurant.location.city}
                    </Text>
                </View>
                <View style={styles.data}>
                    <View style={styles.icon}>
                        <MaterialCommunityIcons name="map-marker-distance" size={18} color="#388e3c" />
                    </View>
                    <Text style={[styles.text, styles[`text${theme}`]]}>
                        {getDistanceFromLatLonInKm(
                            restaurant.location.latitude,
                            restaurant.location.longitude,
                            location.latitude,
                            location.longitude
                        )}
                    </Text>
                </View>
                <View style={styles.data}>
                    <View style={styles.icon}>
                        <AntDesign name="star" size={17} color="#fbc02d" />
                    </View>
                    {ratingAverage ?
                        <Text style={[styles.text, styles[`text${theme}`]]}>
                            {ratingAverage}
                        </Text>
                        :
                        <Text style={[styles.text, styles[`text${theme}`]]}>
                            No reviews yet
                        </Text>
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default RestaurantCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: CARD_WIDTH,
        borderRadius: 25,
        padding: 10,
        marginBottom: 2,
        zIndex: 2,
        marginHorizontal: 10,
        overflow: 'hidden',
        elevation: 2
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
    image: {
        width: 110,
        height: 110,
        resizeMode: 'cover',
        borderRadius: 20,
        marginRight: 10
    },
    data: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 3
    },
    icon: {
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4
    },
    text: {
        fontFamily: 'Quicksand',
        transform: [{ translateY: -1 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    title: {
        fontFamily: 'QuicksandBold',
        fontSize: 17,
        marginBottom: 5
    }
});