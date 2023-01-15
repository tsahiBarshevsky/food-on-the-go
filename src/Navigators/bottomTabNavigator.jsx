import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SavedScreen } from '../screens';
import { Host } from 'react-native-portalize';

// Navigators
import MapNavigator from './mapNavigator';
import ProfileNavigator from './profileNavigator';

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
                <Tab.Screen name="Profile" component={ProfileNavigator} />
            </Tab.Navigator>
        </Host>
    )
}

export default BottomBarNavigator;