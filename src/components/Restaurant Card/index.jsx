import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const RestaurantCard = ({ restaurant }) => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: restaurant.image }}
                style={styles.image}
            />
            <Text style={styles.title}>{restaurant.name}</Text>
        </View>
    )
}

export default RestaurantCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'royalblue',
        borderRadius: 10,
        padding: 10,
        zIndex: 2
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 5,
        marginRight: 10
    },
    title: {
        fontWeight: 'bold'
    }
});