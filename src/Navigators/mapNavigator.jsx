import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { MapScreen, RestaurantScreen, ReviewScreen, SearchScreen, UserScreen, SavedMapScreen, UserReviews } from '../screens';

const Stack = createStackNavigator();

const MapNavigator = () => {
    const options = {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    };

    return (
        <Stack.Navigator
            initialRouteName='MapMain'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='MapMain' component={MapScreen} options={options} />
            <Stack.Screen name='Restaurant' component={RestaurantScreen} options={options} />
            <Stack.Screen name='Review' component={ReviewScreen} options={options} />
            <Stack.Screen name='Search' component={SearchScreen} options={options} />
            <Stack.Screen name='User' component={UserScreen} options={options} />
            <Stack.Screen name='SavedMap' component={SavedMapScreen} options={options} />
            <Stack.Screen name='UserReviews' component={UserReviews} />
        </Stack.Navigator>
    )
}

export default MapNavigator;