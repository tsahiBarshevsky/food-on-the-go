import React, { useRef, useState } from 'react';
import update from 'immutability-helper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from '../../../components';
import { addCustomList } from '../../../redux/actions/user';
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

const CustomListInsertion = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);
    const [isPublic, setIsPublic] = useState(false);
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

    const onAddCustomList = async () => {
        Keyboard.dismiss();
        const customList = {
            custom: true,
            description: description,
            list: [],
            privacy: isPublic ? 'public' : 'private'
        };
        const userRef = doc(db, "users", user.uid);
        const saved = update(user.saved, {
            [name.toLowerCase().trim()]: { $set: customList }
        });
        try {
            await updateDoc(userRef, { saved: saved }); // Update document on Firestore
            dispatch(dispatch(addCustomList(name.toLowerCase().trim(), customList))); // Update store
            navigation.goBack();
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
                    <TouchableOpacity onPress={onAddCustomList}>
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

export default CustomListInsertion;

const styles = StyleSheet.create({});