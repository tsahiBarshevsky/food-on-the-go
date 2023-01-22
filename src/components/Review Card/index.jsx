import React, { useState } from 'react';
import update from 'immutability-helper';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Menu, MenuItem } from 'react-native-material-menu';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview, dislikeReview, likeReview } from '../../redux/actions/restaurants';
import { authentication } from '../../utils/firebase';

// firebase
import { doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const AVATAR_SIZE = 35;

const ReviewCard = ({ review, currentRating, restaurant, reviewIndex }) => {
    const [visible, setVisible] = useState(false);
    const currentUser = authentication.currentUser;
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

    const navigateToProfile = async () => {
        if (currentUser.uid === review.user.uid)
            navigation.getParent().navigate('Profile');
        else {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", review.user.uid));
            const userQuerySnapshot = await getDocs(q);
            const user = userQuerySnapshot.docs[0].data();
            navigation.navigate('User', { user: user, name: review.user.displayName });
        }
    }

    const onDeleteReview = async () => {
        const index = restaurants.findIndex((item) => item.id === restaurant.id); // Index in restaurants array
        const restaurantRef = doc(db, "restaurants", restaurant.id);
        const reviews = restaurants[index].reviews;
        const reviewIndex = reviews.findIndex((review) => review.user.uid === currentUser.uid);
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

    const handleLikeReview = async () => {
        const restaurantRef = doc(db, "restaurants", restaurant.id);
        const restaurantIndex = restaurants.findIndex((item) => item.id === restaurant.id);
        if (review.likes.includes(currentUser.uid)) { // dislike
            const likeIndex = restaurant.reviews[reviewIndex].likes.findIndex((item) => item === currentUser.uid);
            const updatedReviews = update(restaurant.reviews, {
                [reviewIndex]: {
                    likes: {
                        $splice: [[likeIndex, 1]]
                    }
                }
            });
            try {
                await updateDoc(restaurantRef, { reviews: updatedReviews }); // Update document on Firestore
                dispatch(dislikeReview(restaurantIndex, reviewIndex, likeIndex)); // Update store
            }
            catch (error) {
                console.log(error.message);
            }
        }
        else { // like
            const updatedReviews = update(restaurant.reviews, {
                [reviewIndex]: {
                    likes: {
                        $push: [currentUser.uid]
                    }
                }
            });
            try {
                await updateDoc(restaurantRef, { reviews: updatedReviews }); // Update document on Firestore
                dispatch(likeReview(restaurantIndex, reviewIndex, currentUser.uid)); // Update store
            }
            catch (error) {
                console.log(error.message);
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text>index{reviewIndex}</Text>
            <View style={styles.header}>
                <View style={styles.user}>
                    {review.user.image ?
                        <TouchableOpacity onPress={navigateToProfile}>
                            <Image
                                source={{ uri: review.user.image }}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={navigateToProfile}
                            style={styles.avatar}
                        >
                            <Text style={styles.letter}>
                                {review.user.displayName.charAt(0)}
                            </Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={navigateToProfile}>
                        <View>
                            <Text>{review.user.displayName}</Text>
                            <Text>{review.user.email}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {review.user.uid === currentUser.uid &&
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
            {review.comment &&
                <Text>{review.comment}</Text>
            }
            <View>
                {currentUser.uid !== review.user.uid &&
                    <TouchableOpacity onPress={handleLikeReview}>
                        {review.likes.includes(currentUser.uid) ?
                            <AntDesign name="like1" size={24} color="black" />
                            :
                            <AntDesign name="like2" size={24} color="black" />
                        }
                    </TouchableOpacity>
                }
                <Text>{review.likes.length}</Text>
            </View>
        </View>
    )
}

export default ReviewCard;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20
    },
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
    image: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        marginRight: 10
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