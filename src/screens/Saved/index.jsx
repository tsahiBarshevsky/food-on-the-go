import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../utils/globalStyles';
import { CustomListPanel } from '../../components';

const SavedScreen = () => {
    const bottomSheetRef = useRef(null);
    const user = useSelector(state => state.user);
    console.log('user.saved', user.saved)
    const navigation = useNavigation();

    const onListPressed = (list) => {
        navigation.navigate('SavedMap', { list });
    }

    return (
        <>
            <View style={globalStyles.container}>
                <TouchableOpacity onPress={() => bottomSheetRef.current?.open()}>
                    <Text>Add list</Text>
                </TouchableOpacity>
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Your lists</Text>
                    <TouchableOpacity
                        onPress={() => onListPressed('favorites')}
                        disabled={user.saved.favorites.length === 0}
                        style={styles.listItem}
                    >
                        <View style={styles.icon}>
                            <AntDesign name="hearto" size={22} color="red" />
                        </View>
                        <View>
                            <Text>Favorites</Text>
                            <Text>{user.saved.favorites.length} Places</Text>
                        </View>
                        <AntDesign name="arrowright" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        onPress={() => onListPressed('interested')}
                        disabled={user.saved.interested.length === 0}
                        style={styles.listItem}
                    >
                        <View style={styles.icon}>
                            <Feather name="flag" size={24} color="green" />
                        </View>
                        <View>
                            <Text>Interested</Text>
                            <Text>{user.saved.interested.length} Places</Text>
                        </View>
                        <AntDesign name="arrowright" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <CustomListPanel bottomSheetRef={bottomSheetRef} />
        </>
    )
}

export default SavedScreen;

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 15
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 12
    },
    icon: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: 35,
        height: 40,
        marginRight: 5
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'black'
    }
});