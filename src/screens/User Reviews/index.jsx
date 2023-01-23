import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { MinimalReviewCard, SortingPanel } from '../../components';
import globalStyles from '../../utils/globalStyles';

const UserReviews = ({ route }) => {
    const { reviews } = route.params;
    const [isSorting, setIsSorting] = useState(false);
    const [sortingType, setSortingType] = useState(null);

    const onSortingTypeSelected = (type) => {
        if (type === sortingType) {
            setIsSorting(false);
            setSortingType(null);
        }
        else {
            setIsSorting(true);
            setSortingType(type);
        }
    }

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
        <View style={globalStyles.container}>
            <FlatList
                data={isSorting ? [...reviews].sort(sortReviews) : reviews}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => {
                    return (
                        <View>
                            <Text>Sort by</Text>
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
        </View>
    )
}

export default UserReviews;

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    blue: {
        backgroundColor: 'royalblue'
    }
});