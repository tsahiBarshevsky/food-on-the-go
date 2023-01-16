import React, { useState, useCallback } from 'react';
import moment from 'moment/moment';
import update from 'immutability-helper';
import { Entypo } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateRating } from '../../redux/actions/review';
import { RatingBar } from '../../components';
import { authentication } from '../../utils/firebase';
import { addNewReview, editReview } from '../../redux/actions/restaurants';
import globalStyles from '../../utils/globalStyles';

// React Native components
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    BackHandler,
    Keyboard,
    Image
} from 'react-native';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const AVATAR_SIZE = 45;

const ReviewScreen = ({ route }) => {
    const { currentRating, restaurant } = route.params;
    const review = useSelector(state => state.review);
    const restaurants = useSelector(state => state.restaurants);
    const [comment, setComment] = useState(Object.keys(review).length === 1 ? '' : review.comment);
    const [isFocused, setIsFocused] = useState(false)
    const user = authentication.currentUser;
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const resetReview = () => {
        dispatch(updateRating(currentRating));
    }

    const onCancelReview = () => {
        resetReview();
        navigation.goBack();
    }

    const onPostReview = async () => {
        Keyboard.dismiss();
        const restaurantRef = doc(db, "restaurants", restaurant.id);
        const index = restaurants.findIndex((item) => item.id === restaurant.id); // Index in restaurants array
        const newReview = {
            comment: comment,
            date: moment().format('DD/MM/YYYY'),
            rating: review.rating,
            user: {
                displayName: user.displayName,
                email: user.email,
                uid: user.uid,
                image: user.photoURL
            }
        };
        if (Object.keys(review).length === 1) { // add new review
            const newReviews = update(restaurant.reviews, {
                $push: [newReview]
            });
            try {
                await updateDoc(restaurantRef, { reviews: newReviews }); // Update document on Firestore
                dispatch(addNewReview(index, newReview)); // Update store
                dispatch({
                    type: 'SET_REVIEW',
                    review: newReview
                });
            }
            catch (error) {
                console.log(error.message);
            }
        }
        else { // Edit existing review
            const reviews = restaurants[index].reviews;
            const reviewIndex = reviews.findIndex((review) => review.user.uid === user.uid);
            const editedReviews = update(restaurant.reviews, {
                [reviewIndex]: {
                    $set: newReview
                }
            });
            try {
                await updateDoc(restaurantRef, { reviews: editedReviews }); // Update document on Firestore
                dispatch(editReview(index, reviewIndex, newReview)); // Update store
                dispatch({
                    type: 'SET_REVIEW',
                    review: newReview
                });
            }
            catch (error) {
                console.log(error.message);
            }
        }
        if (isFocused) { // Check if comment's textinput focused
            setTimeout(() => {
                navigation.goBack();
            }, 500);
        }
        else
            navigation.goBack();
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                resetReview();
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <View style={globalStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => onCancelReview()}
                    style={styles.backButton}
                >
                    <Entypo name="chevron-left" size={22} color="black" />
                </TouchableOpacity>
                <Text>{restaurant.name}</Text>
                <TouchableOpacity
                    onPress={onPostReview}
                >
                    <Text>Post</Text>
                </TouchableOpacity>
            </View>
            {/* <Text>Old: {currentRating}</Text>
            <Text>New: {review.rating}</Text> */}
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <View style={styles.user}>
                        {user.photoURL ?
                            <Image
                                source={{ uri: user.photoURL }}
                                style={styles.image}
                            />
                            :
                            <View style={styles.avatar}>
                                <Text style={styles.letter}>
                                    {user.displayName.charAt(0)}
                                </Text>
                            </View>
                        }
                        <View>
                            <Text>{user.displayName}</Text>
                            <Text>{user.email}</Text>
                        </View>
                    </View>
                    <View style={styles.ratingBar}>
                        <RatingBar
                            origin='review'
                            currentRating={currentRating}
                            restaurant={restaurant}
                        />
                    </View>
                    <Text>Share some thoughts about...</Text>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            placeholder="It's optional, you don't have to"
                            value={comment}
                            onChangeText={(text) => setComment(text)}
                            underlineColorAndroid="transparent"
                            // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                            // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                            multiline
                            blurOnSubmit={false}
                            onBlur={() => setIsFocused(false)}
                            onFocus={() => setIsFocused(true)}
                            style={styles.textInput}
                        />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

export default ReviewScreen;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingHorizontal: 15,
        paddingBottom: 20
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
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
        fontSize: 25,
        textTransform: 'capitalize',
        transform: [{ translateY: -1 }]
    },
    ratingBar: {
        paddingVertical: 10
    },
    scrollView: {
        paddingHorizontal: 15,
        paddingBottom: 15
    }
});