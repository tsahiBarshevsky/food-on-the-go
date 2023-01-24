import React from 'react';
import { StyleSheet, Animated, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { AntDesign } from '@expo/vector-icons';
import WheelPicker from 'react-native-wheely';
import update from 'immutability-helper';
import moment from 'moment/moment';
import { hours } from '../../utils/constants';

const TimePicker = ({
    bottomSheetRef,
    open,
    setOpen,
    close,
    setClose,
    openHours,
    setOpenHours,
    index
}) => {
    const onConfirm = () => {
        const openTime = moment(hours[open], "HH:mm");
        const closeTime = moment(hours[close], "HH:mm");
        if (openTime.isBefore(closeTime)) {
            const newArray = update(openHours, {
                [index]: {
                    $merge: { open: open, close: close }
                }
            });
            setOpenHours(newArray);
            bottomSheetRef.current?.close();
        }
        else
            ToastAndroid.show('Open before close not allowed', ToastAndroid.SHORT);
    }

    return (
        <Portal>
            <Modalize
                ref={bottomSheetRef}
                threshold={50}
                adjustToContentHeight
                withHandle={false}
                modalStyle={styles.modalStyle}
                openAnimationConfig={{ timing: { duration: 200 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
                useNativeDriver
                customRenderer={
                    <Animated.View style={styles.bottomSheetContainer}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
                                <AntDesign name="close" size={20} color="black" />
                            </TouchableOpacity>
                            <Text>Select Hours</Text>
                            <TouchableOpacity onPress={onConfirm}>
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
                    </Animated.View>
                }
            />
        </Portal>
    )
}

export default TimePicker;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: 225
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