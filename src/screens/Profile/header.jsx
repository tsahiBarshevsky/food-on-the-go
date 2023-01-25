import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';

const AVATAR_SIZE = 90;

const Header = (props) => {
    const { navigation, currentUser, onUploadNewImage, ownedRestaurant, onRemoveRestaurant } = props;
    const { theme } = useContext(GlobalContext);
    const user = useSelector(state => state.user);

    return (
        <View>
            <View style={styles.header}>
                <View style={[styles.avatarWrapper, styles[`avatarWrapper${theme}`]]}>
                    <TouchableOpacity
                        onPress={onUploadNewImage}
                        style={[styles.camera, styles[`camera${theme}`]]}
                        activeOpacity={0.85}
                    >
                        <FontAwesome name="camera" size={13} color={theme === 'Light' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    {currentUser.photoURL ?
                        <Image
                            source={{ uri: currentUser.photoURL }}
                            style={styles.image}
                        />
                        :
                        <View style={styles.avatar}>
                            <Text style={styles.letter}>
                                {currentUser.displayName.charAt(0)}
                            </Text>
                        </View>
                    }
                </View>
                <Text style={[styles.text, styles.name, styles[`text${theme}`]]}>
                    {currentUser.displayName}
                </Text>
                <Text style={[styles.text, styles[`text${theme}`]]}>
                    {currentUser.email}
                </Text>
            </View>
            {user.type === 'owner' ?
                (Object.keys(ownedRestaurant).length === 0 ?
                    <View>
                        <Text style={[styles.title, styles[`text${theme}`]]}>
                            Owned restaurant
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Insertion')}>
                            <Text>Add new restaurant</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View>
                        <Text>My restaurant: {ownedRestaurant.name}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Editing', { restaurant: ownedRestaurant })}>
                            <Text>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onRemoveRestaurant}>
                            <Text>Delete</Text>
                        </TouchableOpacity>
                    </View>)
                :
                null
            }
            <Text style={[styles.title, styles[`text${theme}`]]}>
                Restaurants I've been reviewd
            </Text>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
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
        fontSize: 20,
        lineHeight: 25
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 1.5,
        marginBottom: 10
    },
    avatarWrapperLight: {
        borderColor: 'black'
    },
    avatarWrapperDark: {
        borderColor: 'white'
    },
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: AVATAR_SIZE - 8,
        height: AVATAR_SIZE - 8,
        borderRadius: (AVATAR_SIZE - 8) / 2,
        backgroundColor: lightTheme.icon
    },
    image: {
        width: AVATAR_SIZE - 8,
        height: AVATAR_SIZE - 8,
        borderRadius: (AVATAR_SIZE - 8) / 2
    },
    letter: {
        fontSize: 65,
        fontFamily: 'BebasNeue',
        color: 'white',
        textTransform: 'capitalize',
        transform: [{ translateY: -1 }]
    },
    camera: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 14,
        bottom: 0,
        right: 0,
        zIndex: 1
    },
    cameraLight: {
        backgroundColor: 'black'
    },
    cameraDark: {
        backgroundColor: 'white'
    },
    title: {
        fontSize: 20,
        fontFamily: 'QuicksandBold',
        marginBottom: 5
    }
});