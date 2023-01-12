import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateRating } from '../../redux/actions/review';

const RatingBar = ({ origin, currentRating, restaurant }) => {
    const maxRating = [...Array(5).keys()];
    const review = useSelector(state => state.review);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const Separator = () => (
        <View style={styles.separator} />
    );

    const onStarPressed = (key) => {
        if (key === review.rating && key === 0)
            dispatch(updateRating(-1));
        else
            dispatch(updateRating(key));
        if (origin === 'restaurant')
            setTimeout(() => {
                navigation.navigate('Review', { currentRating, restaurant });
            }, 300);
    }

    return (
        <FlatList
            data={maxRating}
            key={(item) => item.toString()}
            horizontal
            ItemSeparatorComponent={Separator}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => onStarPressed(item)}
                    >
                        {item <= review.rating ?
                            <AntDesign name="star" size={24} color="black" />
                            :
                            <AntDesign name="staro" size={24} color="black" />
                        }
                    </TouchableOpacity>
                )
            }}
        />
    )
}

export default RatingBar;

const styles = StyleSheet.create({
    separator: {
        marginHorizontal: 3
    }
});