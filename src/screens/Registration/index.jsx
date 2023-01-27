import React, { useState, useRef, useEffect, useContext } from 'react';
import update from 'immutability-helper';
import { Formik, ErrorMessage } from 'formik';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DotIndicator } from 'react-native-indicators';
import { Checkbox } from '../../components';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';
import { registrationSchema } from '../../utils/schemas';
import { notify } from '../../utils/firebaseErrors';
import globalStyles from '../../utils/globalStyles';

// React Native components
import {
    StyleSheet,
    Platform,
    SafeAreaView,
    TextInput,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Text,
    TouchableOpacity,
    Keyboard
} from 'react-native';

// Firebase
import { authentication, db } from '../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore/lite';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const RegistrationScreen = () => {
    const { theme } = useContext(GlobalContext);
    const navigation = useNavigation();
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [type, setType] = useState({
        visitor: true,
        owner: false
    });
    const initialValues = {
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    };
    const listOptions = {
        custom: false,
        description: null,
        list: [],
        privacy: 'private'
    };

    // Refs
    const formRef = useRef(null);
    const passwordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);

    const onChageAccountType = (pressed) => {
        var change;
        if (pressed === 'visitor') {
            change = update(type, {
                $merge: {
                    visitor: true,
                    owner: false
                }
            });
            setType(change);
        }
        else {
            change = update(type, {
                $merge: {
                    visitor: false,
                    owner: true
                }
            });
            setType(change);
        }
    }

    const onRegister = (values) => {
        const { email, password, firstName, lastName } = values;
        setDisabled(true);
        Keyboard.dismiss();
        createUserWithEmailAndPassword(authentication, email.trim(), password.trim())
            .then(async (auth) => {
                const user = {
                    uid: auth.user.uid,
                    type: type.visitor ? 'visitor' : 'owner',
                    image: null,
                    saved: {
                        favorites: listOptions,
                        interested: listOptions
                    }
                };
                updateProfile(authentication.currentUser, {
                    displayName: `${firstName.trim()} ${lastName.trim()}`
                });
                // Insert new document to firestore
                try {
                    await setDoc(doc(db, 'users', user.uid), user);
                }
                catch (error) {
                    notify(error.message);
                    setDisabled(false);
                }
            })
            .catch((error) => {
                notify(error.message);
                setDisabled(false);
            });
    }

    useEffect(() => {
        const keyboardOpenListener = Keyboard.addListener("keyboardDidShow", () =>
            setIsKeyboardOpen(true)
        );
        const keyboardCloseListener = Keyboard.addListener("keyboardDidHide", () =>
            setIsKeyboardOpen(false)
        );

        return () => {
            if (keyboardOpenListener) keyboardOpenListener.remove();
            if (keyboardCloseListener) keyboardCloseListener.remove();
        };
    }, []);

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollView, !isKeyboardOpen && styles.center]}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    style={{ width: '100%' }}
                >
                    <Text style={[styles.title, styles[`text${theme}`]]}>Food on the go</Text>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        onSubmit={(values) => onRegister(values)}
                        innerRef={formRef}
                        validationSchema={registrationSchema}
                        validateOnChange={false}
                        validateOnBlur={false}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => {
                            return (
                                <View>
                                    <View
                                        style={[
                                            globalStyles.textInputWrapper,
                                            globalStyles[`textInputWrapper${theme}`]
                                        ]}
                                    >
                                        <TextInput
                                            keyboardType='email-address'
                                            placeholder='Email...'
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                            selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('email')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => passwordRef.current?.focus()}
                                            style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='email'
                                        render={(message) => {
                                            return (
                                                <Text style={[styles.text, globalStyles.error]}>
                                                    {message}
                                                </Text>
                                            )
                                        }}
                                    />
                                    <View
                                        style={[
                                            globalStyles.textInputWrapper,
                                            globalStyles[`textInputWrapper${theme}`],
                                            styles.marginTop
                                        ]}
                                    >
                                        <TextInput
                                            placeholder='Password...'
                                            value={values.password}
                                            ref={passwordRef}
                                            onChangeText={handleChange('password')}
                                            secureTextEntry={showPassword}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                            selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('password')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => firstNameRef.current?.focus()}
                                            style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            activeOpacity={0.85}
                                        >
                                            {showPassword ?
                                                <Entypo
                                                    name="eye"
                                                    size={20}
                                                    style={[globalStyles.eye, globalStyles[`eye${theme}`]]}
                                                />
                                                :
                                                <Entypo
                                                    name="eye-with-line"
                                                    size={20}
                                                    style={[globalStyles.eye, globalStyles[`eye${theme}`]]}
                                                />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <ErrorMessage
                                        name='password'
                                        render={(message) => {
                                            return (
                                                <Text style={[styles.text, globalStyles.error]}>
                                                    {message}
                                                </Text>
                                            )
                                        }}
                                    />
                                    <View
                                        style={[
                                            globalStyles.textInputWrapper,
                                            globalStyles[`textInputWrapper${theme}`],
                                            styles.marginTop
                                        ]}
                                    >
                                        <TextInput
                                            placeholder='First name...'
                                            value={values.firstName}
                                            ref={firstNameRef}
                                            onChangeText={handleChange('firstName')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                            selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('firstName')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => lastNameRef.current?.focus()}
                                            style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='firstName'
                                        render={(message) => {
                                            return (
                                                <Text style={[styles.text, globalStyles.error]}>
                                                    {message}
                                                </Text>
                                            )
                                        }}
                                    />
                                    <View
                                        style={[
                                            globalStyles.textInputWrapper,
                                            globalStyles[`textInputWrapper${theme}`],
                                            styles.marginTop
                                        ]}
                                    >
                                        <TextInput
                                            placeholder='Last name...'
                                            value={values.lastName}
                                            ref={lastNameRef}
                                            onChangeText={handleChange('lastName')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                            selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                            onBlur={handleBlur('lastName')}
                                            onSubmitEditing={handleSubmit}
                                            style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='lastName'
                                        render={(message) => {
                                            return (
                                                <Text style={[styles.text, globalStyles.error]}>
                                                    {message}
                                                </Text>
                                            )
                                        }}
                                    />
                                    <View style={styles.checkboxes}>
                                        <Text style={[styles.text, styles[`text${theme}`]]}>I am a...</Text>
                                        <View style={styles.checkbox}>
                                            <Checkbox
                                                checked={type.visitor}
                                                setChecked={() => onChageAccountType('visitor')}
                                                caption="Visitor"
                                                withCaption
                                            />
                                        </View>
                                        <View style={styles.checkbox}>
                                            <Checkbox
                                                checked={type.owner}
                                                setChecked={() => onChageAccountType('owner')}
                                                caption="Owner"
                                                withCaption
                                            />
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                    </Formik>
                    <TouchableOpacity
                        onPress={() => formRef.current?.handleSubmit()}
                        style={styles.button}
                        activeOpacity={0.85}
                    >
                        {disabled ?
                            <DotIndicator size={5} count={3} color='white' />
                            :
                            <Text style={[styles.text, styles.buttonText]}>Sign Up</Text>
                        }
                    </TouchableOpacity>
                    <View style={styles.signIn}>
                        <Text style={[styles.text, styles[`text${theme}`]]}>
                            Alradey have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.signInText, styles[`signInText${theme}`]]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RegistrationScreen;

const styles = StyleSheet.create({
    scrollView: {
        paddingHorizontal: 15
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: 'DancingScript',
        fontSize: 45,
        textAlign: 'center',
        marginBottom: 35
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
    button: {
        height: 35,
        backgroundColor: lightTheme.icon,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginTop: 25,
        elevation: 2
    },
    buttonText: {
        fontSize: 15,
        color: 'white'
    },
    marginTop: {
        marginTop: 10
    },
    checkboxes: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    checkbox: {
        marginLeft: 15
    },
    signIn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35
    },
    signInText: {
        fontFamily: 'QuicksandBold',
        marginLeft: 5,
        transform: [{ translateY: -1 }]
    },
    signInTextLight: {
        color: '#1a73e8'
    },
    signInTextDark: {
        color: '#8cb4f1'
    }
});