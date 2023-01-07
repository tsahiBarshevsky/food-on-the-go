import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const RatingBar = ({ defaultRating, setDefaultRating }) => {
    const maxRating = [...Array(5).keys()];

    const onStarPressed = (key) => {
        if (key === defaultRating && key === 0)
            setDefaultRating(-1);
        else
            setDefaultRating(key);
    }

    return (
        <View style={styles.container}>
            {maxRating.map((item) => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        key={item}
                        onPress={() => onStarPressed(item)}
                    >
                        {item <= defaultRating ?
                            <AntDesign name="star" size={24} color="black" />
                            :
                            <AntDesign name="staro" size={24} color="black" />
                        }

                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

export default RatingBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    }
});