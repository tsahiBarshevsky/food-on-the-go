import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SavedScreen, ProfileScreen } from '../screens';

// Navigators
import MapNavigator from './mapNavigator';
import { Host } from 'react-native-portalize';

const Tab = createBottomTabNavigator();

const BottomBarNavigator = () => {
    return (
        <Host>
            <Tab.Navigator
                initialRouteName='Map'
                screenOptions={{
                    headerShown: false,
                    tabBarHideOnKeyboard: true
                }}
            >
                <Tab.Screen name="Map" component={MapNavigator} />
                <Tab.Screen name="Saved" component={SavedScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </Host>
    )
}

export default BottomBarNavigator;