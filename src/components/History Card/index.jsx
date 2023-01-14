import React from 'react';
import moment from 'moment/moment';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { hours } from '../../utils/constants';

const HistoryCard = ({ item }) => {
    const today = moment().format('dddd');
    const todayItem = item.openingHours[moment().format('d')];
    const openTime = moment(hours[todayItem.open], "HH:mm");
    const closeTime = moment(hours[todayItem.close], "HH:mm");
    const restaurants = useSelector(state => state.restaurants);
    const navigation = useNavigation();

    const isOpen = () => {
        if (todayItem.isOpen && today === todayItem.day && moment().isBetween(openTime, closeTime))
            return (<Text>Open</Text>);
        else {
            return (<Text>Closed</Text>);
        }
    }

    const onCardPressed = () => {
        const index = restaurants.findIndex((restaurant) => restaurant.id === item.id);
        navigation.navigate('Restaurant', { index });
    }

    return (
        <TouchableOpacity
            onPress={onCardPressed}
            style={styles.container}
            activeOpacity={1}
        >
            <View style={styles.history}>
                <Feather name="clock" size={20} color="black" />
            </View>
            <View>
                <Text>{item.name}</Text>
                <Text>{item.location.city}</Text>
                {isOpen()}
            </View>
        </TouchableOpacity>
    )
}

export default HistoryCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: 'lightblue'
    },
    history: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: 17,
        marginRight: 10,
        backgroundColor: 'grey'
    }
});