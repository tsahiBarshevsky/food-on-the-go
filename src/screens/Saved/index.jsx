import React, { useContext } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import globalStyles from '../../utils/globalStyles';
import { ListCard } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

const SavedScreen = () => {
    const { theme } = useContext(GlobalContext);
    const user = useSelector(state => state.user);
    const navigation = useNavigation();

    const Header = () => (
        <View style={styles.header}>
            <Text style={[styles.title, styles[`text${theme}`]]}>Your lists</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('CustomListInsertion')}
                style={styles.button}
                activeOpacity={0.85}
            >
                <AntDesign
                    name="plus"
                    size={11}
                    style={[styles.icon, styles[`caption${theme}`]]}
                />
                <Text style={[styles.text, styles[`caption${theme}`]]}>Add list</Text>
            </TouchableOpacity>
        </View>
    );

    const Separator = () => (
        <View style={[styles.separator, styles[`separator${theme}`]]} />
    );

    return (
        <SafeAreaView style={globalStyles.container}>
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
        </SafeAreaView>
    )
}

export default SavedScreen;

const styles = StyleSheet.create({
    flatlist: {
        paddingHorizontal: 15
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 10
    },
    title: {
        fontSize: 20,
        fontFamily: 'QuicksandBold',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    icon: {
        marginRight: 5
    },
    separator: {
        width: '100%',
        height: 1,
        marginVertical: 10
    },
    separatorLight: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    separatorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    text: {
        fontFamily: 'Quicksand',
        transform: [{ translateY: -1.75 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    captionLight: {
        color: '#1a73e8'
    },
    captionDark: {
        color: '#8cb4f1'
    }
});