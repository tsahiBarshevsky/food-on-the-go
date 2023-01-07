import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';
import { LocationBox, RestaurantCard } from '../../components';

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

    useEffect(() => {
        fetchData();
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&localityLanguage=en`)
            .then((res) => res.json())
            .then((res) => setStreet(`${res.city}, ${res.countryName}`));
    }, []);

    return restaurants.length > 0 && (
        <View style={styles.container}>
            <LocationBox street={street} />
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    showsBuildings={false}
                    region={{
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}
                >
                    {restaurants.map((restaurant) => {
                        return (
                            <Marker
                                key={restaurant.id}
                                title={restaurant.name}
                                image={
                                    restaurant.type === 'Food Truck' ?
                                        require('../../../assets/food-truck.png')
                                        :
                                        require('../../../assets/coffee-shop.png')
                                }
                                coordinate={{
                                    latitude: restaurant.location.latitude,
                                    longitude: restaurant.location.longitude
                                }}
                            />
                        )
                    })}
                </MapView>
            </View>
            <FlatList
                data={restaurants}
                keyExtractor={(item) => item.id}
                horizontal
                overScrollMode='never'
                showsHorizontalScrollIndicator={false}
                style={styles.cards}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => {
                    return (
                        <RestaurantCard restaurant={item} />
                    )
                }}
            />
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
        height: '100%',
        width: '100%',
    },
    cards: {
        position: 'absolute',
        bottom: 15,
        zIndex: 2,
    },
    separator: {
        marginHorizontal: 5
    }
});