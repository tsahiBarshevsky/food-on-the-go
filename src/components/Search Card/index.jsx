import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Keyboard, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getHistoryFromStorage, updateHistoryInStorage } from '../../utils/AsyncStorageManagement';
import { addNewTermToHistory } from '../../redux/actions/hisorty';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';

const SearchCard = ({ item, keyword }) => {
    const { theme } = useContext(GlobalContext);
    const location = useSelector(state => state.location);
    const restaurants = useSelector(state => state.restaurants);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        if (d > 1) // More than km
            return `${d.toFixed(1)}km`;
        return `${(d * 1000).toFixed(1)}m`;
    }

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180)
    }

    const boldKeyword = (str, find) => {
        const strSplit = str.split('')
        const keywordSplit = keyword.toLowerCase().split('')
        const arr = [];
        strSplit.forEach((item) => {
            if (keywordSplit.includes(item.toLowerCase()))
                arr.push(<Text style={[styles.bold, styles[`bold${theme}`]]}>{item}</Text>)
            else
                arr.push(<Text style={[styles.text, styles[`text${theme}`]]}>{item}</Text>)
        });
        return arr;
    }

    const onCardPressed = () => {
        Keyboard.dismiss();
        const index = restaurants.findIndex((restaurant) => restaurant.id === item.id);
        navigation.navigate('Restaurant', { index });
        getHistoryFromStorage().then((storage) => {
            if (!storage.includes(item.id)) {
                if (storage.length === 0) { //First insertion
                    updateHistoryInStorage(JSON.stringify([item.id])); //Update AsyncStorage
                    dispatch(addNewTermToHistory(item.id)) //Update store
                }
                else {
                    storage.push(item.id);
                    updateHistoryInStorage(JSON.stringify(storage)); //Update AsyncStorage
                    dispatch(addNewTermToHistory(item.id)) //Update store
                }
            }
        });
    }

    return (
        <TouchableOpacity
            onPress={onCardPressed}
            style={styles.container}
            activeOpacity={1}
        >
            <View style={styles.details}>
                <View style={styles.locationBox}>
                    <View style={styles.location}>
                        <FontAwesome5 name="map-marker-alt" size={20} color="white" />
                    </View>
                    <Text style={[styles.text, styles[`text${theme}`]]}>
                        {getDistanceFromLatLonInKm(
                            item.location.latitude,
                            item.location.longitude,
                            location.latitude,
                            location.longitude
                        )}
                    </Text>
                </View>
                <View>
                    <View style={styles.nameWrapper}>
                        {boldKeyword(item.name, keyword)}
                    </View>
                    <Text style={[styles.text, styles[`text${theme}`]]}>{item.location.city}</Text>
                </View>
            </View>
            {item.type === 'Food Truck' ?
                <Image
                    source={require('../../../assets/images/food-truck.png')}
                    style={styles.image}
                />
                :
                <Image
                    source={require('../../../assets/images/food-cart.png')}
                    style={styles.image}
                />
            }
        </TouchableOpacity>
    )
}

export default SearchCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    locationBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 55,
        marginRight: 10
    },
    location: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: 17,
        marginBottom: 3,
        backgroundColor: lightTheme.icon
    },
    nameWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    image: {
        width: 20,
        height: 20
    },
    text: {
        fontFamily: 'Quicksand'
    },
    textLigth: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    bold: {
        fontFamily: 'QuicksandBold'
    },
    boldLigth: {
        color: lightTheme.text
    },
    boldDark: {
        color: darkTheme.text
    }
});