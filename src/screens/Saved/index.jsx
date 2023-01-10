import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AntDesign, Feather } from '@expo/vector-icons';
import globalStyles from '../../utils/globalStyles';

const SavedScreen = () => {
    const user = useSelector(state => state.user);

    return (
        <View style={globalStyles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>Your lists</Text>
                <TouchableOpacity style={styles.listItem}>
                    <View style={styles.icon}>
                        <AntDesign name="hearto" size={22} color="red" />
                    </View>
                    <View>
                        <Text>Favorites</Text>
                        <Text>{user.saved.favorites.length} Places</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.listItem}>
                    <View style={styles.icon}>
                        <Feather name="flag" size={24} color="green" />
                    </View>
                    <View>
                        <Text>Interested</Text>
                        <Text>{user.saved.interested.length} Places</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
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