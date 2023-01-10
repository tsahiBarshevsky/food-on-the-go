import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { AntDesign, Feather } from '@expo/vector-icons';

const SavePanel = ({ bottomSheetRef }) => {
    return (
        <Portal>
            <Modalize
                withOverlay
                ref={bottomSheetRef}
                threshold={50}
                adjustToContentHeight
                withHandle={false}
                modalStyle={styles.modalStyle}
                openAnimationConfig={{ timing: { duration: 200 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
            >
                <View style={styles.bottomSheetContainer}>
                    <Text>Save to...</Text>
                    <TouchableOpacity style={styles.item}>
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <AntDesign name="hearto" size={22} color="red" />
                            </View>
                            <Text>Favorites</Text>
                        </View>
                        <AntDesign name="check" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <Feather name="flag" size={24} color="green" />
                            </View>
                            <Text>Interested</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modalize>
        </Portal>
    )
}

export default SavePanel;

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
    }
});