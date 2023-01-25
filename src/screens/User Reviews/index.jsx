import React, { useState, useContext } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MinimalReviewCard, SortingPanel } from '../../components';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';
import globalStyles from '../../utils/globalStyles';
import { authentication } from '../../utils/firebase';

const UserReviews = ({ route }) => {
    const { user, reviews } = route.params;
    const { theme } = useContext(GlobalContext);
    const [isSorting, setIsSorting] = useState(false);
    const [sortingType, setSortingType] = useState(null);
    const navigation = useNavigation();

    const sortReviews = (a, b) => {
        switch (sortingType) {
            case 'rating':
                return b.review.rating - a.review.rating;
            case 'likes':
                return b.review.likes.length > a.review.likes.length;
            case 'date':
                var a_date = a.review.date.split("/");
                var b_date = b.review.date.split("/");
                var a_dateObject = new Date(+a_date[2], a_date[1] - 1, +a_date[0]);
                var b_dateObject = new Date(+b_date[2], b_date[1] - 1, +b_date[0]);
                return b_dateObject - a_dateObject;
        }
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.85}
                >
                    <Entypo name="chevron-left" size={22} color={theme === 'Light' ? "black" : "white"} />
                </TouchableOpacity>
                <View style={styles.name}>
                    <Text style={[styles.text, styles[`text${theme}`]]}>
                        {user === 'My' ? `${user} reviews` : `${user}'s reviews`}
                    </Text>
                </View>
            </View>
            <FlatList
                data={isSorting ? [...reviews].sort(sortReviews) : reviews}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatList}
                ItemSeparatorComponent={<View style={[styles.separator, styles[`separator${theme}`]]} />}
                ListHeaderComponent={() => {
                    return (
                        <View>
                            <Text style={[styles.text, styles[`text${theme}`]]}>Sort by</Text>
                            <SortingPanel
                                sortingType={sortingType}
                                setSortingType={setSortingType}
                                setIsSorting={setIsSorting}
                            />
                        </View>
                    );
                }}
                renderItem={({ item }) => {
                    return (
                        <MinimalReviewCard
                            restaurant={item}
                            review={item.review}
                        />
                    )
                }}
            />
        </SafeAreaView>
    )
}

export default UserReviews;

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        fontFamily: 'Quicksand',
        transform: [{ translateY: -2 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    header: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 10,
        paddingHorizontal: 15,
        paddingBottom: 10
    },
    name: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatList: {
        paddingHorizontal: 15,
        paddingBottom: 15
    },
    separator: {
        width: '100%',
        height: 1,
        marginVertical: 15
    },
    separatorLight: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    separatorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    }
});