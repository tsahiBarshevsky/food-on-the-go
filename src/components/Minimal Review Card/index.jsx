import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const MinimalReviewCard = ({ restaurant, review }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{restaurant.name}</Text>
            <Text>{restaurant.type}</Text>
            <Text>{restaurant.city}</Text>
            <View style={styles.review}>
                <View style={styles.stars}>
                    {[...Array(5).keys()].map((item) => {
                        if (item <= review.rating)
                            return (<AntDesign key={item} name="star" size={20} color="black" />);
                        else
                            return (<AntDesign key={item} name="staro" size={20} color="black" />);
                    })}
                </View>
                <Text>On {review.date}</Text>
            </View>
            <Text>{review.comment}</Text>
            <Text>{review.likes.length} Likes</Text>
        </View>
    )
}

export default MinimalReviewCard;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        padding: 5
    },
    title: {
        fontSize: 20
    },
    review: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 5
    },
    stars: {
        flexDirection: 'row',
        marginRight: 10
    }
});