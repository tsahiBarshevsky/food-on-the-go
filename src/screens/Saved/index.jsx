import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import globalStyles from '../../utils/globalStyles';
import { ListCard } from '../../components';
import { useNavigation } from '@react-navigation/native';

const SavedScreen = () => {
    const user = useSelector(state => state.user);
    const navigation = useNavigation();

    const Header = () => (
        <View style={styles.header}>
            <Text style={styles.title}>Your lists</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('CustomListInsertion')}
            >
                <Text>Add list</Text>
            </TouchableOpacity>
        </View>
    );

    const Separator = () => (
        <View style={styles.separator} />
    );

    return (
        <>
            <View style={globalStyles.container}>
                <FlatList
                    data={Object.keys(user.saved).sort((a, b) => a.localeCompare(b))}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={styles.flatlist}
                    ListHeaderComponent={Header}
                    ItemSeparatorComponent={Separator}
                    renderItem={({ item }) => {
                        return (
                            <ListCard
                                item={user.saved[item]}
                                name={item}
                            />
                        );
                    }}
                />
            </View>
        </>
    )
}

export default SavedScreen;

const styles = StyleSheet.create({
    flatlist: {
        paddingHorizontal: 15
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
});