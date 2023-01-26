import React, { useContext } from 'react';
import moment from 'moment/moment';
import { StyleSheet, Text, View, TouchableOpacity, Keyboard } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { hours } from '../../utils/constants';
import { lightTheme, darkTheme } from '../../utils/themes';
import { GlobalContext } from '../../utils/context';

const HistoryCard = ({ item }) => {
    const { theme } = useContext(GlobalContext);
    const today = moment().format('dddd');
    const todayItem = item.openingHours[moment().format('d')];
    const openTime = moment(hours[todayItem.open], "HH:mm");
    const closeTime = moment(hours[todayItem.close], "HH:mm");
    const restaurants = useSelector(state => state.restaurants);
    const navigation = useNavigation();

    const isOpen = () => {
        if (todayItem.isOpen && today === todayItem.day && moment().isBetween(openTime, closeTime))
            return true;
        return false;
    }

    const onCardPressed = () => {
        Keyboard.dismiss();
        const index = restaurants.findIndex((restaurant) => restaurant.id === item.id);
        navigation.navigate('Restaurant', { index });
    }

    return (
        <TouchableOpacity
            onPress={onCardPressed}
            style={styles.container}
            activeOpacity={0.85}
        >
            <View style={styles.details}>
                <View style={styles.history}>
                    <Feather name="clock" size={20} color="white" />
                </View>
                <View>
                    <Text style={[styles.text, styles.title, styles[`text${theme}`]]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.text, styles[`text${theme}`]]}>
                        {item.location.city}
                    </Text>
                    {isOpen() ?
                        <Text style={[styles.text, styles.open]}>
                            Open now
                        </Text>
                        :
                        <Text style={[styles.text, styles.close]}>
                            Close now
                        </Text>
                    }
                </View>
            </View>
            <AntDesign name="arrowright" size={20} color={theme === 'Light' ? "black" : "white"} />
        </TouchableOpacity>
    )
}

export default HistoryCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    details: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    history: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: 17,
        marginRight: 15,
        backgroundColor: lightTheme.icon
    },
    title: {
        fontSize: 17
    },
    text: {
        fontFamily: 'Quicksand',
        transform: [{ translateY: -2 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    open: {
        color: '#1b5e20'
    },
    close: {
        color: '#b71c1c'
    }
});