import React, { useState } from 'react';
import update from 'immutability-helper';
import { useDispatch, useSelector } from 'react-redux';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { addCustomList } from '../../redux/actions/user';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const CustomListPanel = ({ bottomSheetRef }) => {
    const [listName, setListName] = useState('');
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const onAddNewCustomList = async () => {
        const userRef = doc(db, "users", user.uid);
        const saved = update(user.saved, {
            [listName.toLowerCase().trim()]: { $set: [] }
        });
        try {
            await updateDoc(userRef, { saved: saved }); // Update document on Firestore
            dispatch(addCustomList(listName.toLowerCase().trim())); // Update store
            setListName('');
            bottomSheetRef.current?.close();
        }
        catch (error) {
            console.log(error.message);
        }
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