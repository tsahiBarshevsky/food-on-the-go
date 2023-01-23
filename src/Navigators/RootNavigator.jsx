import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { lightTheme, darkTheme } from '../utils/themes';
import { GlobalContext } from '../utils/context';
import BottomBarNavigator from './bottomTabNavigator';

// App screens
import {
    RegistrationScreen,
    LoginScreen,
    SplashScreen
} from '../screens';

const Stack = createStackNavigator();

const RootNavigator = () => {
    const { theme } = useContext(GlobalContext);
    const isLoggedIn = useSelector(state => state.isLoggedIn);

    const options = {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    };
    const navigatorTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: theme === 'Light' ? lightTheme.background : darkTheme.background
        }
    };

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
