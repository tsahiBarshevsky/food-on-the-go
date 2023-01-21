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

const ListCard = ({ list, length, setAction, setList, bottomSheetRef }) => {
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

    const onListPressed = (list) => {
        navigation.navigate('SavedMap', { list });
    }

    const check = () => {
        hideMenu();
        setAction('edit');
        setList(list);
        bottomSheetRef.current?.open();
        // const array = user.saved[list];
        // dispatch(removeCustomList(list));
        // dispatch(updateCustomListName('b list', array));
    }

    const onRemoveCustomList = async () => {
        const userRef = doc(db, "users", user.uid);
        const saved = update(user.saved, {
            $unset: [list]
        });
        try {
            await updateDoc(userRef, { saved: saved }); // Update document on Firestore
            dispatch(removeCustomList(list)); // Update store
            hideMenu();
        }
        catch (error) {
            console.log(error.message);
        }
    }

    const renderIcon = () => {
        switch (list) {
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
            onPress={() => onListPressed(list)}
            disabled={length === 0}
            style={styles.container}
        >
            <View style={styles.icon}>
                {renderIcon()}
            </View>
            <View>
                <Text style={styles.title}>{list}</Text>
                <Text>{length} Places</Text>
            </View>
            {list !== 'favorites' && list !== 'interested' &&
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
                        <MenuItem onPress={check}>Edit list</MenuItem>
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