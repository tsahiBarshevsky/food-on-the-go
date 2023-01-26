import React, { useContext } from 'react';
import { StyleSheet, Animated, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { AntDesign } from '@expo/vector-icons';
import WheelPicker from 'react-native-wheely';
import update from 'immutability-helper';
import moment from 'moment/moment';
import { hours } from '../../utils/constants';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';

const TimePicker = (props) => {
    const { theme } = useContext(GlobalContext);
    const { bottomSheetRef,
        chosenDay,
        open,
        setOpen,
        close,
        setClose,
        openHours,
        setOpenHours,
        index
    } = props;

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
                modalStyle={[styles.modal, styles[`modal${theme}`]]}
                openAnimationConfig={{ timing: { duration: 200 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
                useNativeDriver
                customRenderer={
                    <Animated.View style={styles.bottomSheetContainer}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
                                <AntDesign name="close" size={20} color={theme === 'Light' ? 'black' : 'white'} />
                            </TouchableOpacity>
                            <Text style={[styles.text, styles[`text${theme}`]]}>
                                Select hours for {chosenDay}
                            </Text>
                            <TouchableOpacity onPress={onConfirm}>
                                <AntDesign name="check" size={20} color={theme === 'Light' ? 'black' : 'white'} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.pickers}>
                            <WheelPicker
                                selectedIndex={open}
                                options={hours}
                                onChange={(index) => setOpen(index)}
                                flatListProps={{ overScrollMode: 'never' }}
                                selectedIndicatorStyle={[styles.indicator, styles[`indicator${theme}`]]}
                                itemTextStyle={[styles.text, styles[`text${theme}`]]}
                            />
                            <Text style={[styles.text, styles[`text${theme}`]]}>until</Text>
                            <WheelPicker
                                selectedIndex={close}
                                options={hours}
                                onChange={(index) => setClose(index)}
                                flatListProps={{ overScrollMode: 'never' }}
                                selectedIndicatorStyle={[styles.indicator, styles[`indicator${theme}`]]}
                                itemTextStyle={[styles.text, styles[`text${theme}`]]}
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
        height: 225,
        paddingTop: 5
    },
    modal: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalLight: {
        backgroundColor: lightTheme.background
    },
    modalDark: {
        backgroundColor: darkTheme.background
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
    },
    indicator: {
        width: 100,
        alignSelf: 'center',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 0,
    },
    indicatorLight: {
        backgroundColor: lightTheme.background,
        borderTopColor: 'black',
        borderBottomColor: 'black',
    },
    indicatorDark: {
        backgroundColor: darkTheme.background,
        borderTopColor: 'white',
        borderBottomColor: 'white'
    }
});