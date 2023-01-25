import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';

const MinimalReviewCard = ({ restaurant, review }) => {
    const { theme } = useContext(GlobalContext);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, styles.text, styles[`text${theme}`]]}>
                {restaurant.name}
            </Text>
            <Text style={[styles.text, styles[`text${theme}`]]}>
                {restaurant.type} at {restaurant.city}
            </Text>
            <View style={{ paddingVertical: 5 }}>
                <View style={styles.review}>
                    <View style={styles.stars}>
                        {[...Array(5).keys()].map((item) => {
                            if (item <= review.rating)
                                return (<AntDesign key={item} name="star" size={20} color="#f9bb04" />);
                            else
                                return (<AntDesign key={item} name="staro" size={20} color="#f9bb04" />);
                        })}
                    </View>
                    <Text style={[styles.text, styles[`text${theme}`]]}>On {review.date}</Text>
                </View>
                {review.comment &&
                    <Text style={[styles.text, styles[`text${theme}`]]}>{review.comment}</Text>
                }
            </View>
            <View style={styles.likes}>
                <AntDesign name="like1" size={18} style={[styles.icon, styles[`icon${theme}`]]} />
                <Text style={[styles.text, styles[`text${theme}`]]}>({review.likes.length})</Text>
            </View>
        </View>
    )
}

export default MinimalReviewCard;

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Quicksand',
        transform: [{ translateY: -1.5 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    title: {
        fontSize: 17
    },
    review: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 5,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 10
    },
    likes: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 5
    },
    icon: {
        marginRight: 5
    },
    iconLight: {
        color: 'black'
    },
    iconDark: {
        color: 'white'
    }
});