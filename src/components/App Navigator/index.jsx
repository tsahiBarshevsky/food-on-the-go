import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { background } from '../../utils/theme';

// App screens
import {
    RegistrationScreen,
    LoginScreen,
    HomeScreen
} from '../../screens';

const Stack = createStackNavigator();
const navigatorTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: background
    }
};
const options = {
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
};

const AppNavigator = () => {
    return (
        <NavigationContainer theme={navigatorTheme}>
            <Stack.Navigator
                initialRouteName='Login'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name='Registration'
                    component={RegistrationScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={options}
                />
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={options}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;