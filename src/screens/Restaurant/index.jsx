import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as Progress from 'react-native-progress';
import { StyleSheet, ScrollView, Text, View, Image, TouchableOpacity, Linking, BackHandler } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment/moment';
import { hours } from '../../utils/constants';
import { authentication } from '../../utils/firebase';
import { ReviewCard, RatingBar, List, SavePanel } from '../../components';
import globalStyles from '../../utils/globalStyles';

const RestaurantScreen = ({ route }) => {
    const { index } = route.params; // index of restaurant in restaurants array
    const [userRating, setUserRating] = useState(-1);
    const [ratingsSum, setRatingSum] = useState({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 });
    const [ratingAverage, setRatingAverage] = useState(0);
    const restaurants = useSelector(state => state.restaurants);
    const restaurant = restaurants[index];
    const navigation = useNavigation();
    const savePanelRef = useRef(null);
    const dispatch = useDispatch();

    // is open stuff
    const today = moment().format('dddd');
    const item = restaurant.openingHours[moment().format('d')];
    const openTime = moment(hours[item.open], "HH:mm");
    const closeTime = moment(hours[item.close], "HH:mm");

    const onGoBack = () => {
        const routes = navigation.getState()?.routes;
        const prevRoute = routes[routes.length - 2];
        if (prevRoute.name === 'Search')
            navigation.reset({
                index: 0,
                routes: [{ name: 'Map' }]
            });
        else
            navigation.goBack();
    }

    useEffect(() => {
        // Calculate each rating sum
        const sum = {};
        [...Array(5).keys()].forEach((item) => {
            sum[item + 1] = restaurant.reviews.filter((review) => review.rating === item).length;
        });
        setRatingSum(sum);
        // Calculate rating average
        const ratings = restaurant.reviews.map(({ rating }) => rating + 1);
        setRatingAverage(ratings.reduce((a, b) => a + b, 0) / ratings.length);
        // Get user rating
        const review = restaurant.reviews.find((review) => review.user.uid === authentication.currentUser.uid);
        dispatch({ type: 'SET_REVIEW', review: review ? review : {} });
        setUserRating(review?.rating);
    }, [restaurants]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                onGoBack();
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <>
            <View style={globalStyles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.header}>
                        <Image
                            source={
                                typeof restaurant.image === 'string' ?
                                    { uri: restaurant.image }
                                    :
                                    { uri: restaurant.image.url }
                            }
                            style={styles.image}
                        />
                        <TouchableOpacity
                            onPress={onGoBack}
                            style={[styles.button, styles.back]}
                        >
                            <Entypo name="chevron-left" size={25} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => savePanelRef.current?.open()}
                            style={[styles.button, styles.favorite]}
                        >
                            <FontAwesome name="bookmark-o" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>{restaurant.name}</Text>
                    <Text>{restaurant.description}</Text>
                    <Text style={styles.subtitle}>About</Text>
                    <View style={styles.aboutBox}>
                        <View style={styles.icon}>
                            <FontAwesome name="map-marker" size={24} color="black" />
                        </View>
                        <Text>TBA</Text>
                    </View>
                    <View style={styles.aboutBox}>
                        <View style={styles.icon}>
                            <FontAwesome name="shekel" size={20} color="black" />
                        </View>
                        <Text>{restaurant.priceRange.lowest} - {restaurant.priceRange.highest}</Text>
                    </View>
                    <View style={styles.aboutBox}>
                        <View style={styles.icon}>
                            <FontAwesome name="phone" size={20} color="black" />
                        </View>
                        <TouchableOpacity onPress={() => Linking.openURL(`tel: ${restaurant.phone}`)}>
                            <Text>{restaurant.phone}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.aboutBox}>
                        <View style={styles.icon}>
                            <FontAwesome name="link" size={20} color="black" />
                        </View>
                        <TouchableOpacity onPress={() => Linking.openURL(restaurant.link)}>
                            <Text>{restaurant.link}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.openingHours}>
                        <Text style={{ fontSize: 17 }}>Opening hours</Text>
                        {item.isOpen && today === item.day && moment().isBetween(openTime, closeTime) ?
                            <Text style={styles.open}>Open now</Text>
                            :
                            <Text style={styles.close}>Close now</Text>
                        }
                    </View>
                    <List list={restaurant.openingHours} />
                    <Text style={styles.subtitle}>Rate and review</Text>
                    <RatingBar
                        origin='restaurant'
                        currentRating={userRating}
                        restaurant={restaurant}
                    />
                    <Text style={styles.subtitle}>Reviews</Text>
                    {restaurant.reviews.length > 0 ?
                        <View>
                            {Object.keys(ratingsSum).map((key) => {
                                return (
                                    <View key={key} style={styles.rating}>
                                        <View style={{ marginRight: 5 }}>
                                            <Text>{key}</Text>
                                        </View>
                                        <View style={{ width: '96%' }}>
                                            <Progress.Bar
                                                progress={ratingsSum[key] / restaurant.reviews.length}
                                                width={null}
                                                height={10}
                                                color="#4169e1"
                                                unfilledColor="rgba(65, 105, 225, 0.5)"
                                                borderWidth={0}
                                                animationType="timing"
                                                borderRadius={10}
                                            />
                                        </View>
                                    </View>
                                )
                            })}
                            <View>
                                <Text>sum: {ratingAverage}</Text>
                                <Text>{restaurant.reviews.length} Reviews</Text>
                            </View>
                            {restaurant.reviews.map((review) => {
                                return (
                                    <ReviewCard
                                        key={review.user.uid}
                                        review={review}
                                        currentRating={userRating}
                                        restaurant={restaurant}
                                    />
                                )
                            })}
                        </View>
                        :
                        <Text>No reviews yet</Text>
                    }
                </ScrollView>
            </View>
            <SavePanel
                bottomSheetRef={savePanelRef}
                restaurant={restaurant}
            />
        </>
    )
}

export default RestaurantScreen;

const styles = StyleSheet.create({
    scrollView: {
        paddingHorizontal: 15,
        paddingBottom: 15
    },
    header: {
        position: 'relative',
        width: '100%',
        height: 200,
        marginVertical: 10,
        backgroundColor: 'royalblue',
        borderRadius: 15,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.2
    },
    button: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        top: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    back: {
        left: 10
    },
    favorite: {
        right: 10
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 5
    },
    subtitle: {
        fontSize: 17,
        marginVertical: 5
    },
    aboutBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    icon: {
        width: 28,
        height: 28,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    openingHours: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginVertical: 5
    },
    open: {
        color: 'green'
    },
    close: {
        color: 'red'
    },
    rating: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'lightgreen',
        marginBottom: 5,
        width: '100%'
    }
});