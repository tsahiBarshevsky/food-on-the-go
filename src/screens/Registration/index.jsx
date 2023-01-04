import React, { useState, useRef } from 'react';
import { Formik } from 'formik';
import { FontAwesome } from '@expo/vector-icons';
import { authentication } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import gloablStyles from '../../utils/globalStyles';

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
    TouchableOpacity
} from 'react-native';

const { width } = Dimensions.get('screen');

const RegistrationScreen = () => {
    const [type, setType] = useState('');
    const [activeScreen, setActiveScreen] = useState(1);
    const [showPassword, setShowPassword] = useState(true);
    const scrollRef = useRef(null);
    const formRef = useRef(null);
    const passwordRef = useRef(null);

    const nextScreen = (type) => {
        setActiveScreen(prevState => prevState + 1);
        scrollRef.current?.scrollTo({ x: width * activeScreen });
        setType(type);
    }

    const previousScreen = () => {
        setActiveScreen(prevState => prevState - 1);
        scrollRef.current?.scrollTo({ x: width * (activeScreen - 2) });
    }

    const onRegister = (values) => {
        const { email, password } = values;
        createUserWithEmailAndPassword(authentication, email.trim(), password.trim())
            .catch((error) => console.log('error', error))
    }

    return (
        <SafeAreaView style={gloablStyles.container}>
            <ScrollView
                horizontal
                ref={scrollRef}
                decelerationRate="normal"
                snapToInterval={width}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                overScrollMode="never"
                pagingEnabled
                style={{ width: width }}
                scrollEnabled={false}
                nestedScrollEnabled
            >
                <View style={[styles.screen, styles.center]}>
                    <Text>Create user as...</Text>
                    <TouchableOpacity onPress={() => nextScreen('owner')}>
                        <Text>Food Truck owner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => nextScreen('visitor')}>
                        <Text>Visitor</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.screen}>
                    {/* <Text>{type}</Text> */}
                    {type === 'owner' ?
                        <TouchableOpacity onPress={previousScreen}>
                            <Text>Previous screen</Text>
                        </TouchableOpacity>
                        :
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
                                <TouchableOpacity onPress={previousScreen}>
                                    <Text>Previous screen</Text>
                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                        </ScrollView>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RegistrationScreen;

const styles = StyleSheet.create({
    screen: {
        width: width,
        paddingHorizontal: 15,
        backgroundColor: 'deepskyblue'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});