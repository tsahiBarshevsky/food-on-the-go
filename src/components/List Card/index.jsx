import React, { useState } from 'react';
import update from 'immutability-helper';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Feather, Ionicons, Entypo } from '@expo/vector-icons';
import { Menu, MenuItem } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';
import { removeCustomList, updateCustomListName } from '../../redux/actions/user';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const ListCard = ({ item, name }) => {
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
                return <AntDesign name="hearto" size={22} color="red" />;
            case 'interested':
                return <Feather name="flag" size={24} color="green" />;
            default:
                return <Ionicons name="list" size={26} color="black" />;
        }
    }

    return (
        <TouchableOpacity
            onPress={onListPressed}
            disabled={item.list.length === 0}
            style={styles.container}
        >
            <View style={styles.icon}>
                {renderIcon()}
            </View>
            <View>
                <Text style={styles.title}>{name}</Text>
                <Text>{item.list.length} Places</Text>
            </View>
            {name !== 'favorites' && name !== 'interested' &&
                <View>
                    <Menu
                        visible={visible}
                        anchor={
                            <TouchableOpacity onPress={showMenu}>
                                <Entypo name="dots-three-vertical" size={20} color="black" />
                            </TouchableOpacity>
                        }
                        onRequestClose={hideMenu}
                    >
                        <MenuItem onPress={onEditCustomList}>Edit list</MenuItem>
                        <MenuItem onPress={onRemoveCustomList}>Delete list</MenuItem>
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
        justifyContent: 'space-between',
        paddingVertical: 12
    },
    title: {
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