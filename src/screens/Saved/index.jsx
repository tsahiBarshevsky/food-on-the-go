import React, { useState, useRef } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import globalStyles from '../../utils/globalStyles';
import { CustomListPanel, ListCard } from '../../components';
import { useNavigation } from '@react-navigation/native';

const SavedScreen = () => {
    const [action, setAction] = useState('insertion');
    const [list, setList] = useState('');
    const user = useSelector(state => state.user);
    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();

    const Header = () => (
        <View style={styles.header}>
            <Text style={styles.title}>Your lists</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('CustomListInsertion')}
            // onPress={() => { bottomSheetRef.current?.open(); setAction('insertion') }}
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
                                list={item}
                                length={user.saved[item].list.length}
                                setAction={setAction}
                                setList={setList}
                                bottomSheetRef={bottomSheetRef}
                            />
                        );
                    }}
                />
            </View>
            <CustomListPanel
                bottomSheetRef={bottomSheetRef}
                action={action}
                list={list}
            />
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