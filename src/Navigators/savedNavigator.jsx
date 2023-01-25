import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SavedScreen, SavedMapScreen, RestaurantScreen, CustomListInsertion, CustomListEditing, UserScreen, UserReviews } from '../screens';

const Stack = createStackNavigator();

const SavedNavigator = () => {
    const options = {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    };

    return (
        <Stack.Navigator
            initialRouteName='SavedMain'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='SavedMain' component={SavedScreen} options={options} />
            <Stack.Screen name='SavedMap' component={SavedMapScreen} options={options} />
            <Stack.Screen name='Restaurant' component={RestaurantScreen} options={options} />
            <Stack.Screen name='CustomListInsertion' component={CustomListInsertion} options={options} />
            <Stack.Screen name='CustomListEditing' component={CustomListEditing} options={options} />
            <Stack.Screen name='User' component={UserScreen} options={options} />
            <Stack.Screen name='UserReviews' component={UserReviews} />
        </Stack.Navigator>
    )
}

export default SavedNavigator;