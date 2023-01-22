import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen, RestaurantScreen, ReviewScreen, SearchScreen, UserScreen, SavedMapScreen } from '../screens';

const Stack = createStackNavigator();

const MapNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='MapMain'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='MapMain' component={MapScreen} />
            <Stack.Screen name='Restaurant' component={RestaurantScreen} />
            <Stack.Screen name='Review' component={ReviewScreen} />
            <Stack.Screen name='Search' component={SearchScreen} />
            <Stack.Screen name='User' component={UserScreen} />
            <Stack.Screen name='SavedMap' component={SavedMapScreen} />
        </Stack.Navigator>
    )
}

export default MapNavigator;