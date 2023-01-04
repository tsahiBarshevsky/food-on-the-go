import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authentication } from '../../utils/firebase';
import globalStyles from '../../utils/globalStyles';

// React Native components
import {
    StyleSheet,
    Dimensions,
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

const LoginScreen = () => {
    const [loaded, setLoaded] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const formRef = useRef(null);
    const passwordRef = useRef(null);
    const navigation = useNavigation();

    const onSignIn = (values) => {
        const { email, password } = values;
        Keyboard.dismiss();
        signInWithEmailAndPassword(authentication, email.trim(), password.trim())
            .catch((error) => console.log(error.message))
    }

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user)
                navigation.replace('Home');
            else
                setTimeout(() => {
                    setLoaded(true);
                }, 1000);
        });
        return unsubscribe;
    }, []);

    return loaded ? (
        <SafeAreaView style={globalStyles.container}>
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
                        initialValues={{ email: '', password: '' }}
                        enableReinitialize
                        onSubmit={(values) => onSignIn(values)}
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
                                            onBlur={handleBlur('password')}
                                            onSubmitEditing={handleSubmit}
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
                                </View>
                            )
                        }}
                    </Formik>
                    <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                        <Text>Register</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    ) : (
        <View style={globalStyles.container}>
            <Text>Loading...</Text>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({});