import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { WaveIndicator } from 'react-native-indicators';
import { getHistoryFromStorage } from '../../utils/AsyncStorageManagement';
import { GlobalContext } from '../../utils/context';

// firebase
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { authentication, db } from '../../utils/firebase';

const SplashScreen = () => {
    const { theme } = useContext(GlobalContext);
    const location = useSelector(state => state.location);
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
                const ownedRestaurant = restaurants.find((restaurant) => restaurant.owner === user.uid);
                if (ownedRestaurant)
                    dispatch({
                        type: 'SET_OWNED_RESTAURANT',
                        ownedRestaurant: ownedRestaurant
                    });
            }
            // Get actual location
            getLocation().then((coordinates) => {
                console.log('coordinates', coordinates)
                fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&localityLanguage=en`)
                    .then((res) => res.json())
                    .then((res) => {
                        const location = {
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                            city: `${res.city}, ${res.countryName}`
                        };
                        dispatch({
                            type: 'SET_LOCATION',
                            location: location
                        });
                    });
            });
            // Get history search
            getHistoryFromStorage().then((history) => {
                dispatch({ type: 'SET_HISTORY', history: history })
            });
        }
        catch (error) {
            console.log('error.message', error.message)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (Object.keys(location).length > 0)
            navigation.replace('Home');
    }, [location]);

    return (
        <>
            <StatusBar style={theme === 'Light' ? 'dark' : 'light'} />
            <View style={styles.container}>
                <View style={styles.indicator}>
                    <WaveIndicator
                        waveMode='outline'
                        color={theme === 'Light' ? 'black' : 'white'}
                        size={45}
                    />
                </View>
                <Text style={[styles.text, styles[`text${theme}`]]}>
                    Wait...
                </Text>
                <Text style={[styles.text, styles[`text${theme}`]]}>
                    Fetching data and locating your location.
                </Text>
            </View>
        </>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 65
    },
    indicator: {
        width: 45,
        height: 45,
        marginBottom: 10
    },
    text: {
        fontSize: 16,
        fontFamily: 'Quicksand',
        textAlign: 'center'
    },
    textLight: {
        color: 'black'
    },
    textDark: {
        color: 'white'
    }
});