import React, { useState, useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';
import { LocationBox, RatingBar, RestaurantCard } from '../../components';
import { CARD_WIDTH, SPACING_FOR_CARD_INSET } from '../../utils/constants';

// firebase
import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const HomeScreen = () => {
    const [street, setStreet] = useState('');
    const coordinates = {
        latitude: 32.01784,
        longitude: 34.75616
    };
    const navigation = useNavigation();
    const restaurants = useSelector(state => state.restaurants);
    const dispatch = useDispatch();
    const mapRef = useRef(null);
    const flatlistRef = useRef(null);

    let mapIndex = 0;
    let mapAnimation = new Animated.Value(0);

    const onSignOut = () => {
        signOut(authentication);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        });
    }

    const fetchData = async () => {
        const data = [];
        const querySnapshot = await getDocs(collection(db, "restaurants"));
        querySnapshot.forEach((doc) => data.push(doc.data()));
        dispatch({ type: 'SET_RESTAURANTS', restaurants: data })
    }

    const onMarkerPressed = (index) => {
        let x = (index * CARD_WIDTH) + (index * 20);
        if (Platform.OS === 'ios')
            x = x - 15;
        else
            x = x - 26;
        flatlistRef.current?.scrollTo({ x: x, y: 0, animated: true });
    }

    useEffect(() => {
        fetchData();
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&localityLanguage=en`)
            .then((res) => res.json())
            .then((res) => setStreet(`${res.city}, ${res.countryName}`));
    }, []);

    // Animation control
    useEffect(() => {
        mapAnimation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3);
            if (index >= restaurants.length)
                index = restaurants.length - 1;
            if (index <= 0)
                index = 0

            clearTimeout(regionTimoute);
            const regionTimoute = setTimeout(() => {
                if (mapIndex !== index) {
                    mapIndex = index;
                    const coordinate = restaurants[index].location;
                    mapRef.current?.animateToRegion(
                        {
                            ...coordinate,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        },
                        350
                    );
                }
            }, 10);
        });
    });

    return restaurants.length > 0 && (
        <View style={styles.container}>
            <LocationBox street={street} />
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    showsUserLocation
                    showsBuildings={false}
                    toolbarEnabled={false}
                    style={styles.map}
                    region={{
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}
                >
                    {restaurants.map((restaurant, index) => {
                        const { latitude, longitude } = restaurant.location;
                        return (
                            <Marker
                                key={restaurant.id}
                                image={
                                    restaurant.type === 'Food Truck' ?
                                        require('../../../assets/food-truck.png')
                                        :
                                        require('../../../assets/coffee-shop.png')
                                }
                                coordinate={{
                                    latitude: latitude,
                                    longitude: longitude
                                }}
                                onPress={() => onMarkerPressed(index)}
                            />
                        )
                    })}
                </MapView>
            </View>
            <Animated.ScrollView
                data={restaurants}
                ref={flatlistRef}
                keyExtractor={(item) => item.id}
                horizontal
                overScrollMode='never'
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={1}
                pagingEnabled
                snapToInterval={CARD_WIDTH + 20}
                snapToAlignment="center"
                style={styles.cards}
                contentContainerStyle={{ paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET - 25 : 0 }}
                onScroll={Animated.event(
                    [{
                        nativeEvent: {
                            contentOffset: {
                                x: mapAnimation
                            }
                        }
                    }],
                    { useNativeDriver: true }
                )}
            >
                {restaurants.map((restaurant) => {
                    return (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                        />
                    )
                })}
            </Animated.ScrollView>
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mapContainer: {
        zIndex: 1,
        alignSelf: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
    map: {
        height: '105%',
        width: '100%',
    },
    cards: {
        position: 'absolute',
        bottom: 15,
        zIndex: 2
    },
    separator: {
        marginHorizontal: 5
    }
});