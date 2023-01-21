import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SavedScreen, SavedMapScreen, RestaurantScreen, CustomListInsertion } from '../screens';

const Stack = createStackNavigator();

const SavedNavigator = () => {
    return (
        <NavigationContainer independent>
            <Stack.Navigator
                initialRouteName='Saved'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Saved" component={SavedScreen} />
                <Stack.Screen name='SavedMap' component={SavedMapScreen} />
                <Stack.Screen name='Restaurant' component={RestaurantScreen} />
                <Stack.Screen name='CustomListInsertion' component={CustomListInsertion} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default SavedNavigator;