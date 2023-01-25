import React, { useRef, useState, useContext } from 'react';
import update from 'immutability-helper';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from '../../../components';
import { removeCustomList, updateCustomList } from '../../../redux/actions/user';
import { GlobalContext } from '../../../utils/context';
import { darkTheme, lightTheme } from '../../../utils/themes';
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
    SafeAreaView,
    ToastAndroid,
} from 'react-native';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../../utils/firebase';

const CustomListEditing = ({ route }) => {
    const { theme } = useContext(GlobalContext);
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
        if (name) {
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
        else
            ToastAndroid.show('Name cannot be left blank', ToastAndroid.SHORT);
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.85}
                >
                    <Entypo name="chevron-left" size={22} color={theme === 'Light' ? "black" : "white"} />
                </TouchableOpacity>
                <View style={styles.wrapper}>
                    <Text style={[styles.text, styles.name, styles[`text${theme}`]]}>
                        {listName}
                    </Text>
                    {isPrivate ?
                        <View style={styles.type}>
                            <Entypo name="lock" size={9} style={[styles.icon, styles[`icon${theme}`]]} />
                            <Text style={[styles.text, styles.subtitle, styles[`text${theme}`]]}>Private</Text>
                        </View>
                        :
                        <View style={styles.type}>
                            <MaterialIcons name="public" size={9} style={[styles.icon, styles[`icon${theme}`]]} />
                            <Text style={[styles.text, styles.subtitle, styles[`text${theme}`]]}>Public</Text>
                        </View>
                    }
                </View>
                <TouchableOpacity
                    onPress={onEditCustomList}
                    activeOpacity={0.85}
                    style={styles.button}
                >
                    <Text style={[styles.text, styles.textDark]}>Save</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <View
                        style={[
                            globalStyles.textInputWrapper,
                            globalStyles[`textInputWrapper${theme}`]
                        ]}
                    >
                        <TextInput
                            placeholder='List name...'
                            value={name}
                            onChangeText={(text) => setName(text)}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                            selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                            blurOnSubmit={false}
                            returnKeyType='next'
                            onSubmitEditing={() => descriptionRef.current?.focus()}
                            style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                        />
                    </View>
                    <View
                        style={[
                            globalStyles.textInputWrapper,
                            globalStyles[`textInputWrapper${theme}`],
                            { marginVertical: 10 }
                        ]}
                    >
                        <TextInput
                            placeholder='Description...'
                            ref={descriptionRef}
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            multiline
                            underlineColorAndroid="transparent"
                            placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                            selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                            style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                        />
                    </View>
                    <Checkbox
                        checked={isPrivate}
                        setChecked={() => changePrivacy('private')}
                        caption='Private'
                        withCaption
                    />
                    <Checkbox
                        checked={isPublic}
                        setChecked={() => changePrivacy('public')}
                        caption='Public'
                        withCaption
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CustomListEditing;

const styles = StyleSheet.create({
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
    subtitle: {
        fontSize: 10
    },
    name: {
        textTransform: 'capitalize'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 5,
        paddingHorizontal: 15,
        marginBottom: 15
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 25,
        backgroundColor: lightTheme.icon
    },
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    type: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        paddingRight: 3
    },
    iconLight: {
        color: lightTheme.text
    },
    iconDark: {
        color: darkTheme.text
    }
});