import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import { StyleSheet, ScrollView, Text, View, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { hours } from '../../utils/constants';
import globalStyles from '../../utils/globalStyles';
import ReviewCard from '../../components/Review Card';

const RestaurantScreen = ({ route }) => {
    const { restaurant } = route.params;
    const [ratingsSum, setRatingSum] = useState({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 });
    const [ratingAverage, setRatingAverage] = useState(0);

    useEffect(() => {
        const sum = {};
        [...Array(5).keys()].forEach((item) => {
            sum[item + 1] = restaurant.reviews.filter((review) => review.rating === item + 1).length;
        });
        setRatingSum(sum);
        const ratings = restaurant.reviews.map(({ rating }) => rating);
        setRatingAverage(ratings.reduce((a, b) => a + b, 0) / ratings.length);
    }, []);

    return (
        <View style={globalStyles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Image
                    source={{ uri: restaurant.image }}
                    style={styles.image}
                />
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
                <FlatList
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
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 15,
        marginVertical: 10
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