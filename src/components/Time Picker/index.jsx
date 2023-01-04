import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { AntDesign } from '@expo/vector-icons';
import WheelPicker from 'react-native-wheely';


const TimePicker = ({ bottomSheetRef, hours }) => {
    const [open, setOpen] = useState(0);
    const [close, setClose] = useState(0);

    const onCloseModal = () => {
        setOpen(0);
        setClose(0);
    }

    return (
        <Modalize
            ref={bottomSheetRef}
            threshold={50}
            adjustToContentHeight
            withHandle={false}
            modalStyle={styles.modalStyle}
            openAnimationConfig={{ timing: { duration: 200 } }}
            closeAnimationConfig={{ timing: { duration: 500 } }}
            onClose={onCloseModal}
        >
            <View style={styles.bottomSheetContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
                        <AntDesign name="close" size={20} color="black" />
                    </TouchableOpacity>
                    <Text>Select Hours</Text>
                    <TouchableOpacity onPress={() => {
                        console.log(hours[open] + " - " + hours[close]);
                        onCloseModal();
                        bottomSheetRef.current?.close();
                    }}>
                        <AntDesign name="check" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.pickers}>
                    <WheelPicker
                        selectedIndex={open}
                        options={hours}
                        onChange={(index) => setOpen(index)}
                        flatListProps={{ overScrollMode: 'never' }}
                        selectedIndicatorStyle={{ backgroundColor: 'white', width: 100, alignSelf: 'center', borderTopWidth: 2, borderBottomWidth: 2, borderRadius: 0 }}
                    />
                    <Text>until</Text>
                    <WheelPicker
                        selectedIndex={close}
                        options={hours}
                        onChange={(index) => setClose(index)}
                        flatListProps={{ overScrollMode: 'never' }}
                        selectedIndicatorStyle={{ backgroundColor: 'white', width: 100, alignSelf: 'center', borderTopWidth: 2, borderBottomWidth: 2, borderRadius: 0 }}
                    />
                </View>
            </View>
        </Modalize>
    )
}

export default TimePicker;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
    },
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    pickers: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
    }
});