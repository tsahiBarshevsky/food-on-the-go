import React, { useState } from 'react';
import update from 'immutability-helper';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Menu, MenuItem } from 'react-native-material-menu';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview } from '../../redux/actions/restaurants';
import { authentication } from '../../utils/firebase';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const AVATAR_SIZE = 35;

const ReviewCard = ({ review, currentRating, restaurant }) => {
    const [visible, setVisible] = useState(false);
    const restaurants = useSelector(state => state.restaurants);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const hideMenu = () => {
        setVisible(false);
    }

    const showMenu = () => {
        setVisible(true);
    }

    const onEditReview = () => {
        navigation.navigate('Review', { currentRating, restaurant });
        hideMenu();
    }

    const onDeleteReview = async () => {
        const index = restaurants.findIndex((item) => item.id === restaurant.id); // Index in restaurants array
        const restaurantRef = doc(db, "restaurants", restaurant.id);
        const reviews = restaurants[index].reviews;
        const reviewIndex = reviews.findIndex((review) => review.user.uid === authentication.currentUser.uid);
        const updatedReviews = update(restaurant.reviews, {
            $splice: [[reviewIndex, 1]]
        });
        try {
            await updateDoc(restaurantRef, { reviews: updatedReviews }); // Update document on Firestore
            dispatch(deleteReview(index, reviewIndex)); // Update store
            hideMenu();
        }
        catch (error) {
            console.log(error.message);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
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
                {review.user.uid === authentication.currentUser.uid &&
                    <View>
                        <Menu
                            visible={visible}
                            anchor={
                                <TouchableOpacity onPress={showMenu}>
                                    <Entypo name="dots-three-vertical" size={20} color="black" />
                                </TouchableOpacity>
                            }
                            onRequestClose={hideMenu}
                        >
                            <MenuItem onPress={onEditReview}>Edit review</MenuItem>
                            <MenuItem onPress={onDeleteReview}>Delete review</MenuItem>
                        </Menu>
                    </View>
                }
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
                <Text>On {review.date}</Text>
            </View>
            <Text>{review.comment}</Text>
        </View>
    )
}

export default ReviewCard;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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