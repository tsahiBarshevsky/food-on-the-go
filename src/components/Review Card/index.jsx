import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment/moment';
import { AntDesign } from '@expo/vector-icons';

const AVATAR_SIZE = 35;

const ReviewCard = ({ review }) => {
    return (
        <View style={styles.container}>
            <View style={styles.user}>
                <View style={styles.avatar}>
                    <Text style={styles.letter}>
                        {review.user.email.charAt(0)}
                    </Text>
                </View>
                <View>
                    <Text>{review.user.displayName}</Text>
                    <Text>{review.user.email}</Text>
                </View>
            </View>
            <View style={styles.review}>
                <View style={styles.stars}>
                    {[...Array(5).keys()].map((item) => {
                        if (item <= review.rating)
                            return (<AntDesign key={item} name="star" size={20} color="black" />);
                        else
                            return (<AntDesign key={item} name="staro" size={20} color="black" />);
                    })}
                </View>
                <Text>On {moment.unix(review.date.seconds).format('DD/MM/YYYY')}</Text>
            </View>
            <Text>{review.comment}</Text>
        </View>
    )
}

export default ReviewCard;

const styles = StyleSheet.create({
    user: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: 'black',
        marginRight: 10
    },
    letter: {
        color: 'white',
        fontSize: 18,
        textTransform: 'capitalize',
        transform: [{ translateY: -1 }]
    },
    review: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 5,
        marginBottom: 10
    },
    stars: {
        flexDirection: 'row',
        marginRight: 10
    }
});