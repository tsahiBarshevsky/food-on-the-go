import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SavedScreen, SavedMapScreen, RestaurantScreen, CustomListInsertion, CustomListEditing } from '../screens';

const Stack = createStackNavigator();

const SavedNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='SavedMain'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='SavedMain' component={SavedScreen} />
            <Stack.Screen name='SavedMap' component={SavedMapScreen} />
            <Stack.Screen name='Restaurant' component={RestaurantScreen} />
            <Stack.Screen name='CustomListInsertion' component={CustomListInsertion} />
            <Stack.Screen name='CustomListEditing' component={CustomListEditing} />
        </Stack.Navigator>
    )
}

export default SavedNavigator;