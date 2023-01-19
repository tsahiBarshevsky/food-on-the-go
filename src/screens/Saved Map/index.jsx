import React, { useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RestaurantCard } from '../../components';
import { mapStyleLight, CARD_WIDTH, SPACING_FOR_CARD_INSET } from '../../utils/constants';

const SavedMapScreen = ({ route }) => {
    const { list } = route.params;
    const mapRef = useRef(null);
    const scrollViewRef = useRef(null);
    const user = useSelector(state => state.user);
    const location = useSelector(state => state.location);
    const restaurants = useSelector(state => state.restaurants);
    const listArray = user.saved[list];
    const filtered = [...restaurants].filter((item) => listArray.includes(item.id));

    let mapIndex = 0;
    let mapAnimation = new Animated.Value(0);

    const onMarkerPressed = (index) => {
        let x = (index * CARD_WIDTH) + (index * 20);
        if (Platform.OS === 'ios')
            x = x - 15;
        else
            x = x - 26;
        scrollViewRef.current?.scrollTo({ x: x, y: 0, animated: true });
    }

    // Animation control
    useEffect(() => {
        mapAnimation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3);
            if (index >= filtered.length)
                index = filtered.length - 1;
            if (index <= 0)
                index = 0

            clearTimeout(regionTimoute);
            const regionTimoute = setTimeout(() => {
                if (mapIndex !== index) {
                    mapIndex = index;
                    const coordinate = filtered[index].location;
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

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    // showsUserLocation
                    showsBuildings={false}
                    toolbarEnabled={false}
                    style={styles.map}
                    customMapStyle={mapStyleLight}
                    region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}
                >
                    {filtered.map((restaurant, index) => {
                        const { latitude, longitude } = restaurant.location;
                        return (
                            <Marker
                                key={restaurant.id}
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
                ref={scrollViewRef}
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
                {filtered.map((restaurant) => {
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

export default SavedMapScreen;

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