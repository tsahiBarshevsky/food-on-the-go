import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addRestaurantToSaved, removeRestaurantFromSaved } from '../../redux/actions/user';

const SavePanel = ({ bottomSheetRef, restaurant }) => {
    const user = useSelector(state => state.user);
    const { favorites, interested } = user.saved;
    const dispatch = useDispatch();

    const handleChangeSavedList = (list, id) => {
        const index = eval(list).findIndex((id) => id === restaurant.id);
        if (index !== -1)
            dispatch(removeRestaurantFromSaved(list, index));
        else
            dispatch(addRestaurantToSaved(list, id));
    }

    return (
        <Portal>
            <Modalize
                ref={bottomSheetRef}
                threshold={50}
                adjustToContentHeight
                withHandle={false}
                modalStyle={styles.modalStyle}
                openAnimationConfig={{ timing: { duration: 200 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
            >
                <View style={styles.bottomSheetContainer}>
                    <Text>Save to...</Text>
                    <TouchableOpacity
                        onPress={() => handleChangeSavedList("favorites", restaurant.id)}
                        style={styles.item}
                    >
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <AntDesign name="hearto" size={22} color="red" />
                            </View>
                            <Text>Favorites</Text>
                        </View>
                        {favorites.some((id) => id === restaurant.id) &&
                            <AntDesign name="check" size={24} color="black" />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleChangeSavedList("interested", restaurant.id)}
                        style={styles.item}>
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <Feather name="flag" size={24} color="green" />
                            </View>
                            <Text>Interested</Text>
                        </View>
                        {interested.some((id) => id === restaurant.id) &&
                            <AntDesign name="check" size={24} color="black" />
                        }
                    </TouchableOpacity>
                </View>
            </Modalize>
        </Portal>
    )
}

export default SavePanel;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        marginVertical: 5
    },
    iconAndCaption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    icon: {
        width: 35,
        height: 30,
        justifyContent: 'center'
    }
});