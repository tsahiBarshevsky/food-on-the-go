import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';

const SortingPanel = ({ sortingType, setSortingType, setIsSorting }) => {
    const { theme } = useContext(GlobalContext);

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
        <ScrollView
            horizontal
            overScrollMode='never'
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <TouchableOpacity
                onPress={() => onSortingTypeSelected('rating')}
                activeOpacity={0.85}
                style={[
                    styles.button,
                    sortingType === 'rating' && styles[`selected${theme}`]
                ]}
            >
                <MaterialIcons
                    name="star-outline"
                    size={18}
                    style={[
                        styles.icon,
                        styles[`icon${theme}`],
                        sortingType === 'rating' && styles[`selectedIcon${theme}`]
                    ]}
                />
                <Text
                    style={[
                        styles.text,
                        styles[`text${theme}`],
                        sortingType === 'rating' && styles[`selectedText${theme}`]
                    ]}
                >
                    Top Rated
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onSortingTypeSelected('likes')}
                activeOpacity={0.85}
                style={[
                    styles.button,
                    sortingType === 'likes' && styles[`selected${theme}`],
                    { marginHorizontal: 15 }
                ]}
            >
                <AntDesign
                    name="like2"
                    size={15}
                    style={[
                        styles.icon,
                        styles[`icon${theme}`],
                        sortingType === 'likes' && styles[`selectedIcon${theme}`]
                    ]}
                />
                <Text
                    style={[
                        styles.text,
                        styles[`text${theme}`],
                        sortingType === 'likes' && styles[`selectedText${theme}`]
                    ]}
                >
                    Top Liked
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onSortingTypeSelected('date')}
                activeOpacity={0.85}
                style={[
                    styles.button,
                    sortingType === 'date' && styles[`selected${theme}`]
                ]}
            >
                <AntDesign
                    name="calendar"
                    size={14}
                    style={[
                        styles.icon,
                        styles[`icon${theme}`],
                        sortingType === 'date' && styles[`selectedIcon${theme}`]
                    ]}
                />
                <Text
                    style={[
                        styles.text,
                        styles[`text${theme}`],
                        sortingType === 'date' && styles[`selectedText${theme}`]
                    ]}
                >
                    Newest
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default SortingPanel;

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 15
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#5f6266'
    },
    selectedLight: {
        borderColor: lightTheme.icon,
        backgroundColor: '#d3e1f8'
    },
    selectedDark: {
        borderColor: darkTheme.icon,
        backgroundColor: '#394456'
    },
    icon: {
        marginRight: 5
    },
    iconLight: {
        color: 'black'
    },
    iconDark: {
        color: 'white'
    },
    selectedIconLight: {
        color: lightTheme.icon
    },
    selectedIconDark: {
        color: darkTheme.icon
    },
    selectedTextLight: {
        color: lightTheme.icon
    },
    selectedTextDark: {
        color: darkTheme.icon
    },
    text: {
        fontFamily: 'Quicksand',
        transform: [{ translateY: -1.5 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    }
});