import React, { useState, useEffect, useRef, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik, ErrorMessage } from 'formik';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';
import { loginSchema } from '../../utils/schemas';
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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authentication } from '../../utils/firebase';

const LoginScreen = () => {
    const { theme } = useContext(GlobalContext);
    const [disabled, setDisabled] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const formRef = useRef(null);
    const passwordRef = useRef(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const onSignIn = (values) => {
        const { email, password } = values;
        setDisabled(true);
        Keyboard.dismiss();
        signInWithEmailAndPassword(authentication, email.trim(), password.trim())
            .catch((error) => {
                notify(error.message);
                setDisabled(false);
            })
    }

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user)
                dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: true });
            else
                setTimeout(() => {
                    setLoaded(true);
                }, 1000);
        });
        return unsubscribe;
    }, []);

    return loaded ? (
        <>
            <StatusBar style={theme === 'Light' ? 'dark' : 'light'} />
            <SafeAreaView style={globalStyles.container}>
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollView}
                >
                    <KeyboardAvoidingView
                        enabled
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        style={{ width: '100%' }}
                    >
                        <Text style={[styles.title, styles[`text${theme}`]]}>Food on the go</Text>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            enableReinitialize
                            onSubmit={(values) => onSignIn(values)}
                            innerRef={formRef}
                            validationSchema={loginSchema}
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
                                                onBlur={handleBlur('password')}
                                                onSubmitEditing={handleSubmit}
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
                                <Text style={[styles.text, styles.buttonText]}>Sign In</Text>
                            }
                        </TouchableOpacity>
                        <View style={styles.signUp}>
                            <Text style={[styles.text, styles[`text${theme}`]]}>
                                Don't have an account?
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Registration')}
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.signUpText, styles[`signUpText${theme}`]]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
        </>
    ) : (
        <>
            <StatusBar style={theme === 'Light' ? 'dark' : 'light'} />
            <SafeAreaView style={styles.loadingContainer}>
                <WaveIndicator
                    waveMode='outline'
                    color={theme === 'Light' ? 'black' : 'white'}
                    size={45}
                />
            </SafeAreaView>
        </>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    loadingContainer: {
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
    signUp: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35
    },
    signUpText: {
        fontFamily: 'QuicksandBold',
        marginLeft: 5,
        transform: [{ translateY: -1 }]
    },
    signUpTextLight: {
        color: '#1a73e8'
    },
    signUpTextDark: {
        color: '#8cb4f1'
    }
});