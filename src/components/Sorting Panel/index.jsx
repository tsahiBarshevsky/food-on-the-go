import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

const SortingPanel = (props) => {
    const {
        sortingPanelRef,
        setIsSorting,
        sortingType, setSortingType
    } = props;

    const onSortingTypeSelected = (type) => {
        if (type === sortingType) {
            setIsSorting(false);
            setSortingType(null);
        }
        else {
            setIsSorting(true);
            setSortingType(type);
        }
        sortingPanelRef.current?.close();
    }

    return (
        <Portal>
            <Modalize
                ref={sortingPanelRef}
                threshold={50}
                adjustToContentHeight
                withHandle={false}
                modalStyle={styles.modalStyle}
                openAnimationConfig={{ timing: { duration: 200 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
            >
                <View style={styles.bottomSheetContainer}>
                    <Text>Sort by...</Text>
                    <TouchableOpacity
                        onPress={() => onSortingTypeSelected('rating')}
                        style={styles.item}
                    >
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <MaterialIcons name="star-outline" size={24} color="black" />
                            </View>
                            <Text style={styles.title}>Top Rated</Text>
                        </View>
                        {sortingType === 'rating' &&
                            <AntDesign name="check" size={24} color="black" />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onSortingTypeSelected('likes')}
                        style={styles.item}
                    >
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <AntDesign name="like1" size={24} color="black" />
                            </View>
                            <Text style={styles.title}>Top Liked</Text>
                        </View>
                        {sortingType === 'likes' &&
                            <AntDesign name="check" size={24} color="black" />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onSortingTypeSelected('date')}
                        style={styles.item}
                    >
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <AntDesign name="calendar" size={24} color="black" />
                            </View>
                            <Text style={styles.title}>Newest</Text>
                        </View>
                        {sortingType === 'date' &&
                            <AntDesign name="check" size={24} color="black" />
                        }
                    </TouchableOpacity>
                </View>
            </Modalize>
        </Portal>
    )
}

export default SortingPanel;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        marginVertical: 5
    },
    iconAndCaption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    icon: {
        width: 35,
        height: 30,
        justifyContent: 'center'
    },
    title: {
        textTransform: 'capitalize'
    }
});