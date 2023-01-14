import React, { useEffect } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// firebase
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { authentication, db } from '../../utils/firebase';

const SplashScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permissions not granted');
            return;
        }
        const location = await Location.getCurrentPositionAsync();
        const { coords } = location;
        if (coords)
            return coords;
    }

    const fetchData = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", authentication.currentUser.uid));
        try {
            // Fetch restaurants
            const restaurantsQuerySnapshot = await getDocs(collection(db, "restaurants"));
            const restaurants = restaurantsQuerySnapshot.docs.map((doc) => doc.data());
            dispatch({
                type: 'SET_RESTAURANTS',
                restaurants: restaurants
            });
            // Fetch user data
            const userQuerySnapshot = await getDocs(q);
            const user = userQuerySnapshot.docs[0].data();
            dispatch({
                type: 'SET_USER',
                user: user
            });
            // Check if user is food truck's owner
            if (user.type === 'owner') {
                const ownedRestaurants = restaurants.filter((restaurant) => restaurant.owner === user.uid);
                dispatch({
                    type: 'SET_OWNED_RESTAURANTS',
                    ownedRestaurants: ownedRestaurants
                });
            }
            // Get actual location
            getLocation().then((coordinates) => {
                fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&localityLanguage=en`)
                    .then((res) => res.json())
                    .then((res) => {
                        const location = {
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                            street: `${res.city}, ${res.countryName}`
                        };
                        dispatch({
                            type: 'SET_LOCATION',
                            location: location
                        });
                    });
            });
        }
        catch (error) {
            console.log('error.message', error.message)
        }
        finally {
            navigation.replace('Home');
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Loding data...</Text>
        </View>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});