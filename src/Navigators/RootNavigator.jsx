import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { background } from '../utils/theme';
import BottomBarNavigator from './bottomTabNavigator';

// App screens
import {
    RegistrationScreen,
    LoginScreen,
    SplashScreen
} from '../screens';

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

const RootNavigator = () => {
    const isLoggedIn = useSelector(state => state.isLoggedIn);

    return (
        <NavigationContainer theme={navigatorTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isLoggedIn ?
                    <Stack.Group>
                        <Stack.Screen
                            name='Login'
                            component={LoginScreen}
                            options={options}
                        />
                        <Stack.Screen
                            name='Registration'
                            component={RegistrationScreen}
                            options={options}
                        />
                    </Stack.Group>
                    :
                    <Stack.Group>
                        <Stack.Screen
                            name='Splash'
                            component={SplashScreen}
                            options={options}
                        />
                        <Stack.Screen
                            name='Home'
                            component={BottomBarNavigator}
                            options={options}
                        />
                    </Stack.Group>
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootNavigator;
