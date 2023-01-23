import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

const SortingPanel = ({ sortingType, setSortingType, setIsSorting }) => {
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

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => onSortingTypeSelected('rating')}
                style={[
                    styles.button,
                    sortingType === 'rating' && styles.blue
                ]}
            >
                <MaterialIcons name="star-outline" size={24} color="black" />
                <Text>Top Rated</Text>
                {sortingType === 'rating' &&
                    <AntDesign name="check" size={24} color="black" />
                }
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onSortingTypeSelected('likes')}
                style={[
                    styles.button,
                    sortingType === 'likes' && styles.blue
                ]}
            >
                <AntDesign name="like1" size={24} color="black" />
                <Text>Top Liked</Text>
                {sortingType === 'likes' &&
                    <AntDesign name="check" size={24} color="black" />
                }
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onSortingTypeSelected('date')}
                style={[
                    styles.button,
                    sortingType === 'date' && styles.blue
                ]}
            >
                <AntDesign name="calendar" size={24} color="black" />
                <Text>Newest</Text>
                {sortingType === 'date' &&
                    <AntDesign name="check" size={24} color="black" />
                }
            </TouchableOpacity>
        </View>
    )
}

export default SortingPanel;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    blue: {
        backgroundColor: 'royalblue'
    }
});