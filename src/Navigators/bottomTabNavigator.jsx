import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FavouritesScreen, ProfileScreen } from '../screens';

// Navigators
import MapNavigator from '../Navigators/mapNavigator';

const Tab = createBottomTabNavigator();

const BottomBarNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName='Map'
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Map" component={MapNavigator} />
            <Tab.Screen name="Favourites" component={FavouritesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}

export default BottomBarNavigator;