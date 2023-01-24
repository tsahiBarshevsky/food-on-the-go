import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Host } from 'react-native-portalize';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { GlobalContext } from '../utils/context';
import { darkTheme, lightTheme } from '../utils/themes';

// Navigators
import MapNavigator from './mapNavigator';
import SavedNavigator from './savedNavigator';
import ProfileNavigator from './profileNavigator';

const Tab = createBottomTabNavigator();

const BottomBarNavigator = () => {
    const { theme } = useContext(GlobalContext);
    const ICON_SIZE = 20;

    return (
        <Host>
            <Tab.Navigator
                initialRouteName='Map'
                screenOptions={{
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        // height: 55,
                        backgroundColor: theme === 'Light' ? lightTheme.bottomBar : darkTheme.bottomBar,
                        borderTopWidth: 1,
                        borderTopColor: 'rgba(255, 255, 255, 0.1)',
                    }
                }}
            >
                <Tab.Screen
                    name="Map"
                    component={MapNavigator}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return focused ? (
                                <View style={[styles.container, styles[`container${theme}`]]}>
                                    <Feather
                                        style={styles.icon}
                                        name="map"
                                        size={ICON_SIZE}
                                        color={theme === 'Light' ? lightTheme.icon : darkTheme.icon}
                                    />
                                    <Text style={[styles.text, styles[`text${theme}`]]}>Map</Text>
                                </View>
                            ) : (
                                <Feather name="map" size={ICON_SIZE} color={focused ? "#ffffff99" : "#a8a9ad"} />
                            )
                        }
                    }}
                />
                <Tab.Screen
                    name="Saved"
                    component={SavedNavigator}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return focused ? (
                                <View style={[styles.container, styles[`container${theme}`]]}>
                                    <FontAwesome
                                        style={styles.icon}
                                        name="bookmark-o"
                                        size={ICON_SIZE}
                                        color={theme === 'Light' ? lightTheme.icon : darkTheme.icon}
                                    />
                                    <Text style={[styles.text, styles[`text${theme}`]]}>Saved</Text>
                                </View>
                            ) : (
                                <FontAwesome name="bookmark-o" size={ICON_SIZE} color={focused ? "#ffffff99" : "#a8a9ad"} />
                            )
                        }
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileNavigator}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return focused ? (
                                <View style={[styles.container, styles[`container${theme}`]]}>
                                    <AntDesign
                                        style={styles.icon}
                                        name="user"
                                        size={ICON_SIZE}
                                        color={theme === 'Light' ? lightTheme.icon : darkTheme.icon}
                                    />
                                    <Text style={[styles.text, styles[`text${theme}`]]}>Profile</Text>
                                </View>
                            ) : (
                                <AntDesign name="user" size={ICON_SIZE} color={focused ? "#ffffff99" : "#a8a9ad"} />
                            )
                        }
                    }}
                />
            </Tab.Navigator>
        </Host>
    )
}

export default BottomBarNavigator;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        borderRadius: 50,
        width: '85%'
    },
    containerLight: {
        backgroundColor: lightTheme.focused
    },
    containerDark: {
        backgroundColor: darkTheme.focused
    },
    icon: {
        paddingRight: 7
    },
    text: {
        fontFamily: 'Quicksand',
        transform: [{ translateY: -1.5 }]
    },
    textLight: {
        color: lightTheme.icon
    },
    textDark: {
        color: darkTheme.icon
    }
});