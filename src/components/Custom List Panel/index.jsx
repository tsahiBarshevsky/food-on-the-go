import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { addCustomList } from '../../redux/actions/user';

const CustomListPanel = ({ bottomSheetRef }) => {
    const [listName, setListName] = useState('');
    const dispatch = useDispatch();

    const onAddNewCustomList = () => {
        dispatch(addCustomList(listName.toLowerCase().trim()));
        setListName('');
        bottomSheetRef.current?.close();
    }

    const onCloseModal = () => {
        Keyboard.dismiss();
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
                onClose={onCloseModal}
                scrollViewProps={{ showsVerticalScrollIndicator: false }}
                useNativeDriver
            >
                <View style={styles.textInputWrapper}>
                    <TextInput
                        placeholder='List name...'
                        value={listName}
                        onChangeText={(text) => setListName(text)}
                        underlineColorAndroid="transparent"
                        // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                        // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                        onSubmitEditing={() => onAddNewCustomList()}
                        style={styles.textInput}
                    />
                </View>
            </Modalize>
        </Portal>
    )
}

export default CustomListPanel;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
});