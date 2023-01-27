import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { darkTheme, lightTheme } from '../../utils/themes';
import { GlobalContext } from '../../utils/context';
import globalStyles from '../../utils/globalStyles';

const RestaurantBox = ({ restaurant, onRemoveRestaurant }) => {
    const { theme } = useContext(GlobalContext);
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const hideMenu = () => {
        setVisible(false);
    }

    const showMenu = () => {
        setVisible(true);
    }

    const onEditRestaurant = () => {
        hideMenu();
        navigation.navigate('Editing', { restaurant: restaurant });
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: restaurant.image.url }}
                    style={styles.image}
                    resizeMode='cover'
                />
            </View>
            <View style={[styles.details, styles[`details${theme}`]]}>
                <Text style={[styles.text, styles.name, styles[`text${theme}`]]}>{restaurant.name}</Text>
                <Menu
                    visible={visible}
                    anchor={
                        <TouchableOpacity
                            onPress={showMenu}
                            activeOpacity={0.85}
                        >
                            <Entypo
                                name="dots-three-vertical"
                                size={15}
                                color={theme === 'Light' ? 'black' : 'white'}
                            />
                        </TouchableOpacity>
                    }
                    onRequestClose={hideMenu}
                    style={[globalStyles.menu, globalStyles[`menu${theme}`]]}
                >
                    <MenuItem
                        onPress={onEditRestaurant}
                        pressColor='transparent'
                    >
                        <Text style={[styles.text, styles[`text${theme}`]]}>Edit restaurant</Text>
                    </MenuItem>
                    <MenuItem
                        onPress={onRemoveRestaurant}
                        pressColor='transparent'
                    >
                        <Text style={[styles.text, styles[`text${theme}`]]}>Delete restaurant</Text>
                    </MenuItem>
                </Menu>
            </View>
        </View>
    )
}

export default RestaurantBox;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 170,
        borderRadius: 15,
        elevation: 2,
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 15
    },
    imageWrapper: {
        width: '100%',
        height: '70%'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    details: {
        flexDirection: 'row',
        height: '30%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    detailsLight: {
        backgroundColor: lightTheme.box,
    },
    detailsDark: {
        backgroundColor: darkTheme.box,
    },
    text: {
        fontFamily: 'Quicksand',
        transform: [{ translateY: -1.5 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    name: {
        fontSize: 18,
        textTransform: 'capitalize'
    }
});