import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import HistoryCard from '../../components/History Card';
import SearchCard from '../../components/Search Card';
import globalStyles from '../../utils/globalStyles';

const SearchScreen = () => {
    const [keyword, setKeyword] = useState('');
    const restaurants = useSelector(state => state.restaurants);
    const history = useSelector(state => state.history);

    const Separator = () => (
        <View style={styles.separator}>
            <View style={styles.divider} />
        </View>
    );

    return (
        <View style={globalStyles.container}>
            <View style={{ paddingHorizontal: 15 }}>
                <View style={styles.searchBox}>
                    <TextInput
                        value={keyword}
                        placeholder='Search...'
                        onChangeText={(text) => setKeyword(text)}
                        underlineColorAndroid="transparent"
                        // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                        // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                        returnKeyType='search'
                        style={styles.textInput}
                        autoFocus
                    />
                </View>
                {keyword ?
                    <FlatList
                        data={[...restaurants].filter((restaurant) => restaurant.name.toLowerCase().includes(keyword.toLowerCase()))}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={Separator}
                        renderItem={({ item }) => {
                            return (
                                <SearchCard
                                    item={item}
                                    keyword={keyword} />
                            );
                        }}
                    />
                    :
                    <FlatList
                        data={[...restaurants].filter((restaurant) => history.includes(restaurant.id))}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={Separator}
                        ListHeaderComponent={() => <Text>Recent</Text>}
                        ListEmptyComponent={() => <Text>None</Text>}
                        renderItem={({ item }) => {
                            return (<HistoryCard item={item} />);
                        }}
                    />
                }
            </View>
        </View>
    )
}

export default SearchScreen;

const styles = StyleSheet.create({
    searchBox: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)'
    },
    separator: {
        paddingVertical: 10
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)'
    }
});