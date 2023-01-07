import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CARD_WIDTH } from '../../utils/constants';

const RestaurantCard = ({ restaurant }) => {
    const naviation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => naviation.navigate('Restaurant', { restaurant })}
            style={styles.container}
            activeOpacity={1}
        >
            <Image
                source={{ uri: restaurant.image }}
                style={styles.image}
            />
            <Text style={styles.title}>{restaurant.name}</Text>
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