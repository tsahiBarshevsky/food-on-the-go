import React, { useState, useContext } from 'react';
import update from 'immutability-helper';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Feather, Ionicons, Entypo } from '@expo/vector-icons';
import { Menu, MenuItem } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';
import { removeCustomList } from '../../redux/actions/user';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';
import globalStyles from '../../utils/globalStyles';

const ListCard = ({ item, name }) => {
    const { theme } = useContext(GlobalContext);
    const [visible, setVisible] = useState(false);
    const user = useSelector(state => state.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const hideMenu = () => {
        setVisible(false);
    }

    const showMenu = () => {
        setVisible(true);
    }

    const onListPressed = () => {
        navigation.navigate('SavedMap', { list: name, user: user });
    }

    const onEditCustomList = () => {
        hideMenu();
        navigation.navigate('CustomListEditing', { list: item, listName: name });
    }

    const onRemoveCustomList = async () => {
        const userRef = doc(db, "users", user.uid);
        const saved = update(user.saved, {
            $unset: [name]
        });
        try {
            await updateDoc(userRef, { saved: saved }); // Update document on Firestore
            dispatch(removeCustomList(name)); // Update store
            hideMenu();
        }
        catch (error) {
            console.log(error.message);
        }
    }

    const renderIcon = () => {
        switch (name) {
            case 'favorites':
                return <AntDesign name="hearto" size={22} color="#c62828" />;
            case 'interested':
                return <Feather name="flag" size={24} color="#2e7d32" />;
            default:
                return <Ionicons name="list" size={26} color="#1565c0" />;
        }
    }

    const renderAmount = (length) => {
        switch (length) {
            case 0:
                return 'Empty list';
            case 1:
                return 'One place';
            default:
                return `${length} Places`;
        }
    }

    return (
        <TouchableOpacity
            onPress={onListPressed}
            disabled={item.list.length === 0}
            style={styles.container}
            activeOpacity={0.85}
        >
            <View style={styles.left}>
                <View style={styles.icon}>
                    {renderIcon()}
                </View>
                <View>
                    <Text style={[styles.title, styles[`text${theme}`]]}>{name}</Text>
                    <Text style={[styles.text, styles[`text${theme}`]]}>
                        {renderAmount(item.list.length)}
                    </Text>
                </View>
            </View>
            {name !== 'favorites' && name !== 'interested' &&
                <View>
                    <Menu
                        visible={visible}
                        anchor={
                            <TouchableOpacity onPress={showMenu}>
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
                            onPress={onEditCustomList}
                            pressColor='transparent'
                        >
                            <Text style={[styles.text, styles[`text${theme}`]]}>Edit list</Text>
                        </MenuItem>
                        <MenuItem
                            onPress={onRemoveCustomList}
                            pressColor='transparent'
                        >
                            <Text style={[styles.text, styles[`text${theme}`]]}>Delete list</Text>
                        </MenuItem>
                    </Menu>
                </View>
            }
        </TouchableOpacity>
    )
}

export default ListCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    text: {
        fontFamily: 'Quicksand'
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    title: {
        fontFamily: 'QuicksandBold',
        textTransform: 'capitalize'
    },
    icon: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: 35,
        height: 40,
        marginRight: 5
    }
});