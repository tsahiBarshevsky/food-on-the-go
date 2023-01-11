import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RatingBar = ({ defaultRating, setDefaultRating }) => {
    const maxRating = [...Array(5).keys()];
    const navigation = useNavigation();

    const Separator = () => (
        <View style={styles.separator} />
    );

    const onStarPressed = (key) => {
        if (key === defaultRating && key === 0)
            setDefaultRating(-1);
        else
            setDefaultRating(key);
        setTimeout(() => {
            navigation.navigate('Review', { rating: key });
        }, 200);
        setTimeout(() => {
            setDefaultRating(-1);
        }, 500);
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
                        {item <= defaultRating ?
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