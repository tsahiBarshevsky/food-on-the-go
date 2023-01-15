import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen, InsertionScreen, EditingScreen } from '../screens';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
    return (
        <NavigationContainer independent>
            <Stack.Navigator
                initialRouteName='Profile'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name='Profile' component={ProfileScreen} />
                <Stack.Screen name='Insertion' component={InsertionScreen} />
                <Stack.Screen name='Editing' component={EditingScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default ProfileNavigator;