import React, { useState, useContext } from 'react';
import update from 'immutability-helper';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Menu, MenuItem } from 'react-native-material-menu';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview, dislikeReview, likeReview } from '../../redux/actions/restaurants';
import { authentication } from '../../utils/firebase';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

// firebase
import { doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';
import globalStyles from '../../utils/globalStyles';

const AVATAR_SIZE = 35;

const ReviewCard = ({ review, currentRating, restaurant, reviewIndex }) => {
    const { theme } = useContext(GlobalContext);
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
        <View>
            <View style={styles.header}>
                <View style={styles.user}>
                    {review.user.image ?
                        <TouchableOpacity
                            onPress={navigateToProfile}
                            activeOpacity={0.85}
                        >
                            <Image
                                source={{ uri: review.user.image }}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={navigateToProfile}
                            style={styles.avatar}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.letter}>
                                {review.user.displayName.charAt(0)}
                            </Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity
                        onPress={navigateToProfile}
                        activeOpacity={0.85}
                    >
                        <View>
                            <Text style={[styles.text, styles[`text${theme}`]]}>{review.user.displayName}</Text>
                            <Text style={[styles.text, styles[`text${theme}`], styles.email]}>
                                {review.user.email}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {review.user.uid === currentUser.uid &&
                    <View>
                        <Menu
                            visible={visible}
                            anchor={
                                <TouchableOpacity
                                    onPress={showMenu}
                                    activeOpacity={0.85}
                                >
                                    <Entypo name="dots-three-vertical" size={18} color={theme === 'Light' ? "black" : "white"} />
                                </TouchableOpacity>
                            }
                            onRequestClose={hideMenu}
                            style={[globalStyles.menu, globalStyles[`menu${theme}`]]}
                        >
                            <MenuItem
                                pressColor='transparent'
                                onPress={onEditReview}
                            >
                                <Text style={[styles.text, styles[`text${theme}`]]}>Edit review</Text>
                            </MenuItem>
                            <MenuItem
                                pressColor='transparent'
                                onPress={onDeleteReview}
                            >
                                <Text style={[styles.text, styles[`text${theme}`]]}>Delete review</Text>
                            </MenuItem>
                        </Menu>
                    </View>
                }
            </View>
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
            <View style={styles.like}>
                {currentUser.uid !== review.user.uid ?
                    <TouchableOpacity
                        onPress={handleLikeReview}
                        activeOpacity={0.85}
                    >
                        {review.likes.includes(currentUser.uid) ?
                            <AntDesign name="like1" size={22} style={[styles.icon, styles[`icon${theme}`]]} />
                            :
                            <AntDesign name="like2" size={22} style={[styles.icon, styles[`icon${theme}`]]} />
                        }
                    </TouchableOpacity>
                    :
                    <AntDesign name="like1" size={22} style={[styles.icon, styles[`icon${theme}`]]} />
                }
                <Text style={[styles.text, styles[`text${theme}`]]}>({review.likes.length})</Text>
            </View>
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
        justifyContent: 'center',
        marginBottom: 5
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
        backgroundColor: lightTheme.icon,
        marginRight: 10
    },
    letter: {
        fontSize: 25,
        fontFamily: 'BebasNeue',
        color: 'white',
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
    },
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
    email: {
        fontSize: 10
    },
    like: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 5
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