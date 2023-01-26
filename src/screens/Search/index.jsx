import React, { useState, useContext } from 'react';
import { FlatList, StyleSheet, Text, TextInput, ScrollView, View, SafeAreaView, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { HistoryCard, SearchCard } from '../../components';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';
import globalStyles from '../../utils/globalStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SearchScreen = () => {
    const { theme } = useContext(GlobalContext);
    const [keyword, setKeyword] = useState('');
    const restaurants = useSelector(state => state.restaurants);
    const history = useSelector(state => state.history);
    const historyArray = [...restaurants].filter((restaurant) => history.includes(restaurant.id));

    const Header = () => (
        <Text style={[styles.text, styles.title, styles[`text${theme}`]]}>Recent</Text>
    );

    const ListEmptyHistory = () => (
        <View style={styles.emptyList}>
            <Image
                source={require('../../../assets/images/history.png')}
                style={styles.image}
            />
            <Text style={[styles.text, styles[`text${theme}`]]}>
                No search history yet
            </Text>
        </View>
    );

    const ListEmptySearch = () => (
        <View style={styles.emptyList}>
            <Image
                source={require('../../../assets/images/search.png')}
                style={styles.image}
            />
            <Text style={[styles.text, styles[`text${theme}`]]}>
                No search results were found
            </Text>
        </View>
    );

    const Separator = () => (
        <View style={[styles.separator, styles[`separator${theme}`]]} />
    );

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={{ paddingHorizontal: 15, flex: 1 }}>
                <View
                    style={[
                        globalStyles.textInputWrapper,
                        globalStyles[`textInputWrapper${theme}`],
                        styles.searchBox
                    ]}
                >
                    <TextInput
                        value={keyword}
                        placeholder='Search here'
                        onChangeText={(text) => setKeyword(text)}
                        underlineColorAndroid="transparent"
                        placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                        selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                        returnKeyType='search'
                        autoFocus
                        style={[
                            globalStyles.textInput,
                            globalStyles[`textInput${theme}`],
                            styles.textInput
                        ]}
                    />
                    {keyword &&
                        <TouchableOpacity
                            onPress={() => setKeyword('')}
                            activeOpacity={0.85}
                        >
                            <AntDesign
                                name="close"
                                size={18}
                                color={theme === 'Light' ? lightTheme.text : darkTheme.text}
                            />
                        </TouchableOpacity>
                    }
                </View>
                {keyword.trim() ?
                    <FlatList
                        data={[...restaurants].filter((restaurant) => restaurant.name.toLowerCase().includes(keyword.toLowerCase().trim()))}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={Separator}
                        ListEmptyComponent={ListEmptySearch}
                        contentContainerStyle={styles.flatlist}
                        keyboardShouldPersistTaps="always"
                        renderItem={({ item }) => {
                            return (
                                <SearchCard
                                    key={item.id}
                                    item={item}
                                    keyword={keyword}
                                />
                            );
                        }}
                    />
                    :
                    <FlatList
                        data={historyArray}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={Separator}
                        ListHeaderComponent={historyArray.length > 0 && Header}
                        ListEmptyComponent={ListEmptyHistory}
                        contentContainerStyle={styles.flatlist}
                        keyboardShouldPersistTaps="always"
                        renderItem={({ item }) => {
                            return (<HistoryCard item={item} />);
                        }}
                    />
                }
            </View>
        </SafeAreaView>
    )
}

export default SearchScreen;

const styles = StyleSheet.create({
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
    title: {
        fontSize: 17,
        marginBottom: 15
    },
    searchBox: {
        marginTop: 10,
        marginBottom: 15,
        justifyContent: 'space-between'
    },
    separator: {
        width: '100%',
        height: 1,
        marginVertical: 10
    },
    separatorLight: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    separatorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    textInput: {
        transform: [{ translateY: -1.5 }],
        paddingRight: 10
    },
    emptyList: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10
    },
    flatlist: {
        flexGrow: 1,
        paddingBottom: 15
    }
});