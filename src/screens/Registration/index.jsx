import React, { useState, useRef } from 'react';
import update from 'immutability-helper';
import { Formik } from 'formik';
import { FontAwesome } from '@expo/vector-icons';
// import { useDispatch } from 'react-redux';
import { Checkbox } from '../../components';
import gloablStyles from '../../utils/globalStyles';

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
    TouchableOpacity
} from 'react-native';

// Firebase
import { authentication, db } from '../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore/lite';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const RegistrationScreen = () => {
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
        createUserWithEmailAndPassword(authentication, email.trim(), password.trim())
            .then(async (auth) => {
                const user = {
                    uid: auth.user.uid,
                    type: type.visitor ? 'visitor' : 'owner',
                    image: null,
                    saved: {
                        favorites: [],
                        interested: []
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
                    console.log(error.message);
                }
            });
    }

    return (
        <SafeAreaView style={gloablStyles.container}>
            <Text>Registration</Text>
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 15 }}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        onSubmit={(values) => onRegister(values)}
                        innerRef={formRef}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                            return (
                                <View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            keyboardType='email-address'
                                            placeholder='Email...'
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('email')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => passwordRef.current?.focus()}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Password...'
                                            value={values.password}
                                            ref={passwordRef}
                                            onChangeText={handleChange('password')}
                                            secureTextEntry={showPassword}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('password')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => firstNameRef.current?.focus()}
                                            style={styles.textInput}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            {showPassword ?
                                                <FontAwesome
                                                    name="eye"
                                                    size={20}
                                                    style={styles.eye}
                                                />
                                                :
                                                <FontAwesome
                                                    name="eye-slash"
                                                    size={20}
                                                    style={styles.eye}
                                                />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='First name...'
                                            value={values.firstName}
                                            ref={firstNameRef}
                                            onChangeText={handleChange('firstName')}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('firstName')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => lastNameRef.current?.focus()}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Last name...'
                                            value={values.lastName}
                                            ref={lastNameRef}
                                            onChangeText={handleChange('lastName')}
                                            underlineColorAndroid="transparent"
                                            // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                            onBlur={handleBlur('lastName')}
                                            onSubmitEditing={handleSubmit}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <Text>I'm a ...</Text>
                                    <View>
                                        <Checkbox
                                            checked={type.visitor}
                                            setChecked={() => onChageAccountType('visitor')}
                                            caption="Visitor"
                                        />
                                        <Checkbox
                                            checked={type.owner}
                                            setChecked={() => onChageAccountType('owner')}
                                            caption="Owner"
                                        />
                                    </View>
                                </View>
                            )
                        }}
                    </Formik>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RegistrationScreen;

const styles = StyleSheet.create({});