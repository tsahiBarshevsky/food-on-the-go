import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment/moment';
import MapView, { Marker } from 'react-native-maps';
import { Animated, Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { FilterButton, LocationBox, SearchBar, RestaurantCard, FilterPanel } from '../../components';
import { hours, mapStyleLight, CARD_WIDTH, SPACING_FOR_CARD_INSET } from '../../utils/constants';

const MapScreen = () => {
    const restaurants = useSelector(state => state.restaurants);
    const location = useSelector(state => state.location);
    const mapRef = useRef(null);
    const panelRef = useRef(null);
    const scrollViewRef = useRef(null);
    let mapIndex = 0;
    let mapAnimation = new Animated.Value(0);

    // Filters' states
    const [triggerFilter, setTriggerFilter] = useState(false)
    const [filtered, setFiltered] = useState([...restaurants]);
    const [foodTruck, setFoodTruck] = useState(false);
    const [coffeeCart, setCoffeeCart] = useState(false);
    const [isKosher, setIsKosher] = useState(false);
    const [isOpenOnSaturday, setIsOpenOnSaturday] = useState(false);
    const [isVegetarian, setIsVegetarian] = useState(false);
    const [isVegan, setIsVegan] = useState(false);
    const [isGlutenFree, setIsGlutenFree] = useState(false);
    const [isOpenNow, setIsOpenNow] = useState(false);
    const [prices, setPrices] = useState([1, 1000]);

    const applyFilters = () => {
        let updatedList = [...restaurants];

        // Type filters
        if (foodTruck)
            updatedList = updatedList.filter((item) => item.type === 'Food Truck');
        if (coffeeCart)
            updatedList = updatedList.filter((item) => item.type === 'Coffee Cart');
        // Is kosher filter
        if (isKosher)
            updatedList = updatedList.filter((item) => item.kosher);
        // Is open on Saturday filter
        if (isOpenOnSaturday)
            updatedList = updatedList.filter((item) => item.openingHours[6].isOpen);
        // Is vegetarian filter
        if (isVegetarian)
            updatedList = updatedList.filter((item) => item.vegetarian);
        // Is vegan filter
        if (isVegan)
            updatedList = updatedList.filter((item) => item.vegan);
        // Is gluten free filter
        if (isGlutenFree)
            updatedList = updatedList.filter((item) => item.glutenFree);
        // Is open now
        if (isOpenNow) {
            const today = moment().format('dddd');
            updatedList = updatedList.filter((item) => {
                const todayItem = item.openingHours[moment().format('d')];
                const openTime = moment(hours[todayItem.open], "HH:mm");
                const closeTime = moment(hours[todayItem.close], "HH:mm");
                return todayItem.isOpen && today === todayItem.day && moment().isBetween(openTime, closeTime);
            });
        }
        // Prices filter
        if (prices[0] > 1 || prices[1] < 1000)
            updatedList = updatedList.filter((item) => item.priceRange.lowest <= prices[0] && item.priceRange.highest >= prices[1]);
        setFiltered(updatedList);
        setTriggerFilter(false);
    }


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

    useEffect(() => {
        applyFilters();
    }, [triggerFilter]);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.subHeader}>
                        <LocationBox city={location.city} />
                        <FilterButton bottomSheetRef={panelRef} />
                    </View>
                    <SearchBar />
                </View>
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
            <FilterPanel
                bottomSheetRef={panelRef}
                setTriggerFilter={setTriggerFilter}
                foodTruck={foodTruck}
                setFoodTruck={setFoodTruck}
                coffeeCart={coffeeCart}
                setCoffeeCart={setCoffeeCart}
                isKosher={isKosher}
                setIsKosher={setIsKosher}
                isOpenOnSaturday={isOpenOnSaturday}
                setIsOpenOnSaturday={setIsOpenOnSaturday}
                isVegetarian={isVegetarian}
                setIsVegetarian={setIsVegetarian}
                isVegan={isVegan}
                setIsVegan={setIsVegan}
                isGlutenFree={isGlutenFree}
                setIsGlutenFree={setIsGlutenFree}
                isOpenNow={isOpenNow}
                setIsOpenNow={setIsOpenNow}
                prices={prices}
                setPrices={setPrices}
            />
        </>
    )
}

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: '100%',
        position: 'absolute',
        top: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 5,
        paddingHorizontal: 15,
        zIndex: 2
    },
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 7
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