import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { ProfileScreen, InsertionScreen, EditingScreen, UserReviews } from '../screens';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
    const options = {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    };

    return (
        <Stack.Navigator
            initialRouteName='ProfileMain'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='ProfileMain' component={ProfileScreen} options={options} />
            <Stack.Screen name='Insertion' component={InsertionScreen} options={options} />
            <Stack.Screen name='Editing' component={EditingScreen} options={options} />
            <Stack.Screen name='UserReviews' component={UserReviews} options={options} />
        </Stack.Navigator>
    )
}

export default ProfileNavigator;