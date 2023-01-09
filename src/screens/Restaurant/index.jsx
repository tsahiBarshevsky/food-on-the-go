import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import { StyleSheet, ScrollView, Text, View, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { hours } from '../../utils/constants';
import { authentication } from '../../utils/firebase';
import { ReviewCard, RatingBar, List } from '../../components';
import globalStyles from '../../utils/globalStyles';

const RestaurantScreen = ({ route }) => {
    const { restaurant } = route.params;
    const [userRating, setUserRating] = useState(-1);
    const [ratingsSum, setRatingSum] = useState({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 });
    const [ratingAverage, setRatingAverage] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        // Calculate each rating sum
        const sum = {};
        [...Array(5).keys()].forEach((item) => {
            sum[item + 1] = restaurant.reviews.filter((review) => review.rating === item + 1).length;
        });
        setRatingSum(sum);
        // Calculate rating average
        const ratings = restaurant.reviews.map(({ rating }) => rating);
        setRatingAverage(ratings.reduce((a, b) => a + b, 0) / ratings.length);
        // Get user rating
        const review = restaurant.reviews.find((review) => review.user.uid === authentication.currentUser.uid);
        setUserRating(review?.rating);
    }, []);

    return (
        <View style={globalStyles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: restaurant.image }}
                        style={styles.image}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={[styles.button, styles.back]}
                    >
                        <Entypo name="chevron-left" size={25} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
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
                <Text style={styles.subtitle}>Opening hours</Text>
                <List list={restaurant.openingHours} />
                {/* <FlatList
                    data={restaurant.openingHours}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.day}
                    ItemSeparatorComponent={() => <View style={{ marginBottom: 5 }} />}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.openHour}>
                                <Text>{item.day}</Text>
                                {item.isOpen ?
                                    <Text>{hours[item.open]} - {hours[item.close]}</Text>
                                    :
                                    <Text>Closed</Text>
                                }
                            </View>
                        )
                    }}
                /> */}
                <Text style={styles.subtitle}>Rate and review</Text>
                <RatingBar
                    defaultRating={userRating}
                    setDefaultRating={setUserRating}
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
                                <ReviewCard key={review.user.uid} review={review} />
                            )
                        })}
                    </View>
                    :
                    <Text>No reviews yet</Text>
                }
            </ScrollView>
        </View>
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
    openHour: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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