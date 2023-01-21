import React, { useRef, useState } from 'react';
import update from 'immutability-helper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from '../../../components';
import { removeCustomList, updateCustomList } from '../../../redux/actions/user';
import globalStyles from '../../../utils/globalStyles';

// React Native components
import {
    StyleSheet,
    TextInput,
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TouchableOpacity,
    Keyboard,
} from 'react-native';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../../utils/firebase';

const CustomListEditing = ({ route }) => {
    const { list, listName } = route.params;
    const [name, setName] = useState(listName.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    ));
    const [description, setDescription] = useState(list.description);
    const [isPrivate, setIsPrivate] = useState(list.privacy === 'private');
    const [isPublic, setIsPublic] = useState(list.privacy === 'public');
    const user = useSelector(state => state.user);
    const descriptionRef = useRef(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const changePrivacy = (mode) => {
        if (mode === 'private') {
            setIsPrivate(true);
            setIsPublic(false);
        }
        else {
            setIsPrivate(false);
            setIsPublic(true);
        }
    }

    const onEditCustomList = async () => {
        Keyboard.dismiss();
        const array = [...list.list]; // List copy
        const editedCustomList = {
            custom: true,
            description: description,
            list: array,
            privacy: isPublic ? 'public' : 'private'
        };
        const userRef = doc(db, "users", user.uid);
        // Remove old list and insert the new one
        const saved = update(user.saved, {
            $unset: [listName],
            [name.toLowerCase().trim()]: { $set: editedCustomList }
        });
        try {
            await updateDoc(userRef, { saved: saved }); // Update document on Firestore
            // Update store
            dispatch(removeCustomList(listName));
            dispatch(updateCustomList(name.toLowerCase().trim(), editedCustomList));
            navigation.goBack();
            hideMenu();
        }
        catch (error) {
            console.log(error.message);
        }
    }

    return (
        <View style={globalStyles.container}>
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <TouchableOpacity onPress={onEditCustomList}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            placeholder='List name...'
                            value={name}
                            onChangeText={(text) => setName(text)}
                            underlineColorAndroid="transparent"
                            // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                            // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                            blurOnSubmit={false}
                            returnKeyType='next'
                            onSubmitEditing={() => descriptionRef.current?.focus()}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            placeholder='Description...'
                            ref={descriptionRef}
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            multiline
                            underlineColorAndroid="transparent"
                            // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                            // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                            style={styles.textInput}
                        />
                    </View>
                    <Checkbox
                        checked={isPrivate}
                        setChecked={() => changePrivacy('private')}
                        caption='Private'
                    />
                    <Checkbox
                        checked={isPublic}
                        setChecked={() => changePrivacy('public')}
                        caption='Public'
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

export default CustomListEditing;

const styles = StyleSheet.create({});