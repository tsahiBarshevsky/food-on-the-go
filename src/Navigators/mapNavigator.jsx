import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen, RestaurantScreen, ReviewScreen, SearchScreen } from '../screens';

const Stack = createStackNavigator();

const MapNavigator = () => {
    return (
        <NavigationContainer independent>
            <Stack.Navigator
                initialRouteName='Map'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name='Map' component={MapScreen} />
                <Stack.Screen name='Restaurant' component={RestaurantScreen} />
                <Stack.Screen name='Review' component={ReviewScreen} />
                <Stack.Screen name='Search' component={SearchScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MapNavigator;