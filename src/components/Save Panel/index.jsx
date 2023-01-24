import React, { useContext } from 'react';
import update from 'immutability-helper';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addRestaurantToSaved, removeRestaurantFromSaved } from '../../redux/actions/user';
import { lightTheme, darkTheme } from '../../utils/themes';
import { GlobalContext } from '../../utils/context';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const SavePanel = ({ bottomSheetRef, restaurant }) => {
    const { theme } = useContext(GlobalContext);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const renderIcon = (list) => {
        switch (list) {
            case 'favorites':
                return <AntDesign name="hearto" size={22} color="#c62828" />;
            case 'interested':
                return <Feather name="flag" size={24} color="#2e7d32" />;
            default:
                return <Ionicons name="list" size={26} color="#1565c0" />;
        }
    }

    const handleChangeSavedList = async (list, id) => {
        const userRef = doc(db, "users", user.uid);
        const index = user.saved[list].list.findIndex((id) => id === restaurant.id);
        if (index !== -1) { // Remove restaurant from saved list
            const saved = update(user.saved, {
                [list]: {
                    list: {
                        $splice: [[index, 1]]
                    }
                }
            });
            try {
                await updateDoc(userRef, { saved: saved }); // Update document on Firestore
                dispatch(removeRestaurantFromSaved(list, index)); // Update store
            }
            catch (error) {
                console.log(error.message);
            }
        }
        else { // Add restaurant to saved list
            const saved = update(user.saved, {
                [list]: {
                    list: { $push: [id] }
                }
            });
            try {
                await updateDoc(userRef, { saved: saved }); // Update document on Firestore
                dispatch(addRestaurantToSaved(list, id)); // Update store
            }
            catch (error) {
                console.log(error.message);
            }
        }
    }

    return (
        <Portal>
            <Modalize
                ref={bottomSheetRef}
                threshold={50}
                adjustToContentHeight
                withHandle={false}
                modalStyle={[styles.modal, styles[`modal${theme}`]]}
                openAnimationConfig={{ timing: { duration: 200 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
                useNativeDriver
                customRenderer={
                    <Animated.View style={styles.bottomSheetContainer}>
                        <FlatList
                            data={Object.keys(user.saved).sort((a, b) => a.localeCompare(b))}
                            keyExtractor={(item) => item.toString()}
                            showsVerticalScrollIndicator={false}
                            overScrollMode='never'
                            ListHeaderComponent={<Text style={[styles.text, styles[`text${theme}`], { fontSize: 16 }]}>Save to...</Text>}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleChangeSavedList(item, restaurant.id)}
                                        style={styles.item}
                                    >
                                        <View style={styles.iconAndCaption}>
                                            <View style={styles.icon}>
                                                {renderIcon(item)}
                                            </View>
                                            <Text
                                                style={[
                                                    styles.title,
                                                    styles.text,
                                                    styles[`text${theme}`],
                                                    user.saved[item].list.some((id) => id === restaurant.id) && styles.bold
                                                ]}
                                            >
                                                {item}
                                            </Text>
                                        </View>
                                        {user.saved[item].list.some((id) => id === restaurant.id) &&
                                            <AntDesign name="check" size={20} color={theme === 'Light' ? "black" : "white"} />
                                        }
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </Animated.View>
                }
            />
        </Portal>
    )
}

export default SavePanel;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        maxHeight: 230,
        paddingHorizontal: 15,
        paddingTop: 15
    },
    modal: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalLight: {
        backgroundColor: lightTheme.background
    },
    modalDark: {
        backgroundColor: darkTheme.background
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
    },
    title: {
        textTransform: 'capitalize'
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
    bold: {
        fontFamily: 'QuicksandBold'
    }
});