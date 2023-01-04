import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { background } from '../../utils/theme';

// App screens
import { RegistrationScreen } from '../../screens';

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
                initialRouteName='Registration'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name='Registration'
                    component={RegistrationScreen}
                    options={options}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;