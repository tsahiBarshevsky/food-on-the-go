import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import * as Progress from 'react-native-progress';
import { StyleSheet, SafeAreaView, ScrollView, Text, View, Image, TouchableOpacity, Linking, BackHandler } from 'react-native';
import { FontAwesome, FontAwesome5, Entypo, AntDesign } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment/moment';
import { hours } from '../../utils/constants';
import { authentication } from '../../utils/firebase';
import { ReviewCard, RatingBar, List, SavePanel, SortingPanel } from '../../components';
import globalStyles from '../../utils/globalStyles';
import { darkTheme, lightTheme } from '../../utils/themes';
import { GlobalContext } from '../../utils/context';

const RestaurantScreen = ({ route }) => {
    const { index } = route.params; // index of restaurant in restaurants array
    const { theme } = useContext(GlobalContext);
    const [userRating, setUserRating] = useState(-1);
    const [ratingsSum, setRatingSum] = useState({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 });
    const [ratingAverage, setRatingAverage] = useState(0);
    const restaurants = useSelector(state => state.restaurants);
    const restaurant = restaurants[index];
    const navigation = useNavigation();
    const savePanelRef = useRef(null);
    const dispatch = useDispatch();

    // Sorting reviews states
    const [isSorting, setIsSorting] = useState(false);
    const [sortingType, setSortingType] = useState(null);

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

    const sortReviews = (a, b) => {
        switch (sortingType) {
            case 'rating':
                return b.rating - a.rating;
            case 'likes':
                return b.likes.length > a.likes.length;
            case 'date':
                var a_date = a.date.split("/");
                var b_date = b.date.split("/");
                var a_dateObject = new Date(+a_date[2], a_date[1] - 1, +a_date[0]);
                var b_dateObject = new Date(+b_date[2], b_date[1] - 1, +b_date[0]);
                return b_dateObject - a_dateObject;
        }
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
            <SafeAreaView style={globalStyles.container}>
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
                            activeOpacity={0.85}
                        >
                            <Entypo name="chevron-left" size={25} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => savePanelRef.current?.open()}
                            style={[styles.button, styles.favorite]}
                            activeOpacity={0.85}
                        >
                            <FontAwesome name="bookmark-o" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.title, styles[`text${theme}`]]}>{restaurant.name}</Text>
                    <Text style={[styles.text, styles[`text${theme}`]]}>{restaurant.description}</Text>
                    <Text style={[styles.subtitle, styles.text, styles[`text${theme}`]]}>About</Text>
                    <View style={styles.aboutBox}>
                        <View style={styles.icon}>
                            <FontAwesome name="map-marker" size={24} style={styles[`icon${theme}`]} />
                        </View>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(`google.navigation:q=${restaurant.location.latitude}+${restaurant.location.longitude}`)}
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.text, styles[`text${theme}`]]}>{restaurant.location.city}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.aboutBox}>
                        <View style={styles.icon}>
                            <FontAwesome name="phone" size={20} style={styles[`icon${theme}`]} />
                        </View>
                        <TouchableOpacity onPress={() => Linking.openURL(`tel: ${restaurant.phone}`)}>
                            <Text style={[styles.text, styles[`text${theme}`]]}>{restaurant.phone}</Text>
                        </TouchableOpacity>
                    </View>
                    {restaurant.link &&
                        <View style={styles.aboutBox}>
                            <View style={styles.icon}>
                                <FontAwesome name="link" size={20} style={styles[`icon${theme}`]} />
                            </View>
                            <TouchableOpacity
                                onPress={() => Linking.openURL(restaurant.link)}
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.text, styles[`text${theme}`]]}>{restaurant.link}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={styles.aboutBox}>
                        <View style={styles.icon}>
                            <FontAwesome5 name="wheelchair" size={20} style={styles[`icon${theme}`]} />
                        </View>
                        {restaurant.accessible ?
                            <Text style={[styles.text, styles[`text${theme}`]]}>
                                Handicapped accessible
                            </Text>
                            :
                            <Text style={[styles.text, styles[`text${theme}`]]}>
                                Not handicap accessible
                            </Text>
                        }
                    </View>
                    <View style={styles.aboutBox}>
                        <View style={styles.icon}>
                            <FontAwesome name="shekel" size={20} style={styles[`icon${theme}`]} />
                        </View>
                        <Text style={[styles.text, styles[`text${theme}`]]}>
                            {restaurant.priceRange.lowest}₪ - {restaurant.priceRange.highest}₪
                        </Text>
                    </View>
                    <Text style={[styles.subtitle, styles.text, styles[`text${theme}`]]}>Menu</Text>
                    <View style={styles.menu}>
                        <View style={styles.menuItem}>
                            {restaurant.kosher ?
                                <AntDesign name="check" size={20} style={[styles.menuIcon, styles[`icon${theme}`]]} />
                                :
                                <AntDesign name="close" size={20} style={[styles.menuIcon, styles[`icon${theme}`]]} />
                            }
                            <Text style={[styles.text, styles[`text${theme}`]]}>Kosher</Text>
                        </View>
                        <View style={styles.menuItem}>
                            {restaurant.vegetarian ?
                                <AntDesign name="check" size={20} style={[styles.menuIcon, styles[`icon${theme}`]]} />
                                :
                                <AntDesign name="close" size={20} style={[styles.menuIcon, styles[`icon${theme}`]]} />
                            }
                            <Text style={[styles.text, styles[`text${theme}`]]}>Vegetarian</Text>
                        </View>
                        <View style={styles.menuItem}>
                            {restaurant.vegan ?
                                <AntDesign name="check" size={20} style={[styles.menuIcon, styles[`icon${theme}`]]} />
                                :
                                <AntDesign name="close" size={20} style={[styles.menuIcon, styles[`icon${theme}`]]} />
                            }
                            <Text style={[styles.text, styles[`text${theme}`]]}>Vegan</Text>
                        </View>
                        <View style={styles.menuItem}>
                            {restaurant.glutenFree ?
                                <AntDesign name="check" size={20} style={[styles.menuIcon, styles[`icon${theme}`]]} />
                                :
                                <AntDesign name="close" size={20} style={[styles.menuIcon, styles[`icon${theme}`]]} />
                            }
                            <Text style={[styles.text, styles[`text${theme}`]]}>Gluten Free</Text>
                        </View>
                    </View>
                    <View style={styles.openingHours}>
                        <Text style={[styles.subtitle, styles.text, styles[`text${theme}`]]}>Opening hours</Text>
                        {item.isOpen && today === item.day && moment().isBetween(openTime, closeTime) ?
                            <Text style={[styles.text, styles.open]}>Open now</Text>
                            :
                            <Text style={[styles.text, styles.close]}>Close now</Text>
                        }
                    </View>
                    <List list={restaurant.openingHours} />
                    <Text style={[styles.subtitle, styles.text, styles[`text${theme}`]]}>Rate and review</Text>
                    <RatingBar
                        origin='restaurant'
                        currentRating={userRating}
                        restaurant={restaurant}
                    />
                    <Text style={[styles.subtitle, styles.text, styles[`text${theme}`]]}>Reviews</Text>
                    {restaurant.reviews.length > 0 ?
                        <View>
                            <View style={styles.ratings}>
                                <View style={{ width: '70%' }}>
                                    {Object.keys(ratingsSum).map((key) => {
                                        return (
                                            <View key={key}>
                                                <View style={{ width: '100%' }}>
                                                    <Progress.Bar
                                                        progress={ratingsSum[key] / restaurant.reviews.length}
                                                        width={null}
                                                        height={8}
                                                        color='#f9bb04'
                                                        unfilledColor={theme === 'Light' ? '#cecece' : '#3a3a3a'}
                                                        borderWidth={0}
                                                        animationType="timing"
                                                        borderRadius={10}
                                                        style={styles.progressBar}
                                                    />
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                                <View style={styles.average}>
                                    <Text style={[styles.text, styles[`text${theme}`], styles.averageText]}>
                                        {ratingAverage.toFixed(1)}
                                    </Text>
                                    <View style={styles.stars}>
                                        {[...Array(5).keys()].map((item) => {
                                            if (item < Math.floor(ratingAverage))
                                                return (<AntDesign style={{ marginRight: 1 }} key={item} name="star" size={15} color='#f9bb04' />);
                                            else
                                                return (<AntDesign style={{ marginRight: 1 }} key={item} name="staro" size={15} color='#f9bb04' />);
                                        })}
                                    </View>
                                    <Text style={[styles.text, styles[`text${theme}`]]}>
                                        ({restaurant.reviews.length})
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.text, styles[`text${theme}`]]}>Sort by</Text>
                            <SortingPanel
                                sortingType={sortingType}
                                setSortingType={setSortingType}
                                setIsSorting={setIsSorting}
                            />
                            {!isSorting ?
                                restaurant.reviews.map((review, index) => {
                                    return (
                                        <View key={review.user.uid}>
                                            <ReviewCard
                                                review={review}
                                                currentRating={userRating}
                                                restaurant={restaurant}
                                                reviewIndex={index}
                                            />
                                            {index !== restaurant.reviews.length - 1 &&
                                                <View style={[styles.separator, styles[`separator${theme}`]]} />
                                            }
                                        </View>
                                    )
                                })
                                :
                                [...restaurant.reviews].sort(sortReviews).map((review, index) => {
                                    return (
                                        <View key={review.user.uid}>
                                            <ReviewCard
                                                review={review}
                                                currentRating={userRating}
                                                restaurant={restaurant}
                                                reviewIndex={restaurant.reviews.findIndex((r) => r.user.uid === review.user.uid)}
                                            />
                                            {index !== restaurant.reviews.length - 1 &&
                                                <View style={[styles.separator, styles[`separator${theme}`]]} />
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>
                        :
                        <Text style={[styles.text, styles[`text${theme}`]]}>No reviews yet</Text>
                    }
                </ScrollView>
            </SafeAreaView>
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
        paddingBottom: 20
    },
    header: {
        position: 'relative',
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 15,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
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
        fontSize: 25,
        fontFamily: 'QuicksandBold',
        marginBottom: 5
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
    subtitle: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 5
    },
    aboutBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 5
    },
    icon: {
        width: 28,
        height: 28,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconLight: {
        color: 'black'
    },
    iconDark: {
        color: 'white'
    },
    menu: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginRight: 15,
        marginBottom: 5
    },
    menuIcon: {
        marginRight: 7
    },
    openingHours: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    open: {
        color: '#1b5e20'
    },
    close: {
        color: '#b71c1c'
    },
    ratings: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    average: {
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: -3 }]
    },
    averageText: {
        fontSize: 30
    },
    stars: {
        flexDirection: 'row'
    },
    progressBar: {
        marginVertical: 3
    },
    separator: {
        width: '100%',
        height: 1,
        marginVertical: 15
    },
    separatorLight: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    separatorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    }
});