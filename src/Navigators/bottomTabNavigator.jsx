import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Host } from 'react-native-portalize';

// Navigators
import MapNavigator from './mapNavigator';
import SavedNavigator from './savedNavigator';
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
                <Tab.Screen name="Saved" component={SavedNavigator} />
                <Tab.Screen name="Profile" component={ProfileNavigator} />
            </Tab.Navigator>
        </Host>
    )
}

export default BottomBarNavigator;