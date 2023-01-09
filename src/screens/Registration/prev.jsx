import React, { useState, useRef, useEffect } from 'react';
import * as Location from 'expo-location';
import update from 'immutability-helper';
import uuid from 'react-native-uuid';
import { Formik } from 'formik';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { Checkbox, TimePicker } from '../../components';
import { hours, restaurant, schedule } from '../../utils/constants';
import { addNewRestaurant } from '../../redux/actions/restaurants';
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
    TouchableOpacity,
    Keyboard
} from 'react-native';

// Firebase
import { authentication, db } from '../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore/lite';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const { width } = Dimensions.get('screen');

const RegistrationScreen = () => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [type, setType] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [activeScreen, setActiveScreen] = useState(1);
    const [showPassword, setShowPassword] = useState(true);
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(0);
    const [close, setClose] = useState(0);
    const [openHours, setOpenHours] = useState(schedule);
    const [restaurantType, setRestaurantType] = useState({
        foodTruck: true,
        coffeeCart: false
    });

    // Refs
    const timePickerRef = useRef(null);
    const scrollRef = useRef(null);
    const formRef = useRef(null);
    const passwordRef = useRef(null);
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const linkRef = useRef(null);
    const phoneRef = useRef(null);

    // Redux dispatch
    const dispatch = useDispatch();

    const nextScreen = (type) => {
        setActiveScreen(prevState => prevState + 1);
        scrollRef.current?.scrollTo({ x: width * activeScreen });
        setType(type);
    }

    const previousScreen = () => {
        setActiveScreen(prevState => prevState - 1);
        scrollRef.current?.scrollTo({ x: width * (activeScreen - 2) });
    }

    /*const onRegisterVisitor = (values) => {
        const { email, password } = values;
        Keyboard.dismiss();
        createUserWithEmailAndPassword(authentication, email.trim(), password.trim())
            .catch((error) => console.log('error', error));
    }

    const onRegisterOwner = async (values) => {
        const { email, password, name, description, link, phone } = values;
        Keyboard.dismiss();
        // createUserWithEmailAndPassword(authentication, email.trim(), password.trim())
        //     .then(async () => {
        // });
        const restaurant = {
            id: uuid.v4(),
            // owner: authentication.currentUser.email,
            name: name,
            description: description,
            link: link,
            type: restaurantType.foodTruck ? "Food Truck" : "Coffee Cart",
            image: 'https://images.pexels.com/photos/11621146/pexels-photo-11621146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            phone: phone,
            priceRange: {
                lowest: 10,
                highest: 20
            },
            reviews: [],
            openingHours: openHours,
            location: {
                latitude: latitude,
                longitude: longitude
            }
        };
        // Insert new document to firestore
        try {
            await setDoc(doc(db, 'restaurants', restaurant.id), restaurant);
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            console.log('done')
            // dispatch({ type: 'SET_MY_RESTAURANT', myRestaurant: restaurant });
            // dispatch(addNewRestaurant(restaurant));
        }
    }*/

    const onChangeAvailability = (index, status) => {
        const newArray = update(openHours, {
            [index]: {
                $merge: { isOpen: !status }
            }
        });
        setOpenHours(newArray);
    }

    const onChageRestaurantType = (pressed) => {
        var change;
        if (pressed === 'foodTruck') {
            change = update(restaurantType, {
                $merge: {
                    foodTruck: true,
                    coffeeCart: false
                }
            });
            setRestaurantType(change);
        }
        else {
            change = update(restaurantType, {
                $merge: {
                    foodTruck: false,
                    coffeeCart: true
                }
            });
            setRestaurantType(change);
        }
    }

    const onOpenTimeTicker = (index) => {
        setIndex(index);
        setOpen(openHours[index].open);
        setClose(openHours[index].close);
        if (isKeyboardOpen) {
            Keyboard.dismiss();
            setTimeout(() => {
                timePickerRef.current?.open();
            }, 100);
        }
        else
            timePickerRef.current?.open();
    }

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permissions not granted');
            return;
        }
        const location = await Location.getCurrentPositionAsync();
        const { coords } = location;
        if (coords) {
            const { latitude, longitude } = coords;
            setLatitude(latitude);
            setLongitude(longitude);
        }
    }

    useEffect(() => {
        if (type === 'owner')
            getLocation();
    }, [type]);

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
        <>
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
                        {type === 'owner' ?
                            <ScrollView
                                keyboardShouldPersistTaps="always"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 15 }}
                            >
                                <KeyboardAvoidingView
                                    enabled
                                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                                >
                                </KeyboardAvoidingView>
                                <Formik
                                    initialValues={restaurant}
                                    enableReinitialize
                                    onSubmit={(values) => onRegisterOwner(values)}
                                    innerRef={formRef}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                                        return (
                                            <View>
                                                <View style={styles.textInputWrapper}>
                                                    <TextInput
                                                        placeholder='Email...'
                                                        value={values.email}
                                                        onChangeText={handleChange('email')}
                                                        keyboardType='email-address'
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
                                                        onSubmitEditing={() => nameRef.current?.focus()}
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
                                                        placeholder='Name...'
                                                        value={values.name}
                                                        ref={nameRef}
                                                        onChangeText={handleChange('name')}
                                                        underlineColorAndroid="transparent"
                                                        // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                        // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                        blurOnSubmit={false}
                                                        onBlur={handleBlur('name')}
                                                        returnKeyType='next'
                                                        onSubmitEditing={() => descriptionRef.current?.focus()}
                                                        style={styles.textInput}
                                                    />
                                                </View>
                                                <View>
                                                    <Checkbox
                                                        checked={restaurantType.foodTruck}
                                                        setChecked={() => onChageRestaurantType('foodTruck')}
                                                        caption="Food Truck"
                                                    />
                                                    <Checkbox
                                                        checked={restaurantType.coffeeCart}
                                                        setChecked={() => onChageRestaurantType('coffeeCart')}
                                                        caption="Coffee Cart"
                                                    />
                                                </View>
                                                <View style={styles.textInputWrapper}>
                                                    <TextInput
                                                        placeholder='Description...'
                                                        value={values.description}
                                                        ref={descriptionRef}
                                                        onChangeText={handleChange('description')}
                                                        multiline
                                                        underlineColorAndroid="transparent"
                                                        // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                        // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                        blurOnSubmit={false}
                                                        onBlur={handleBlur('description')}
                                                        returnKeyType='next'
                                                        onSubmitEditing={() => linkRef.current?.focus()}
                                                        style={styles.textInput}
                                                    />
                                                </View>
                                                <View style={styles.textInputWrapper}>
                                                    <TextInput
                                                        placeholder='Link...'
                                                        value={values.link}
                                                        ref={linkRef}
                                                        onChangeText={handleChange('link')}
                                                        underlineColorAndroid="transparent"
                                                        // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                        // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                        blurOnSubmit={false}
                                                        onBlur={handleBlur('link')}
                                                        returnKeyType='next'
                                                        onSubmitEditing={() => phoneRef.current?.focus()}
                                                        style={styles.textInput}
                                                    />
                                                </View>
                                                <View style={styles.textInputWrapper}>
                                                    <TextInput
                                                        placeholder='Phone number...'
                                                        value={values.phone}
                                                        ref={phoneRef}
                                                        keyboardType='number-pad'
                                                        maxLength={10}
                                                        onChangeText={handleChange('phone')}
                                                        underlineColorAndroid="transparent"
                                                        // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                        // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                        onBlur={handleBlur('phone')}
                                                        onSubmitEditing={handleSubmit}
                                                        style={styles.textInput}
                                                    />
                                                </View>
                                                <View>
                                                    {openHours.map((item, index) => {
                                                        return (
                                                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <Checkbox
                                                                    checked={item.isOpen}
                                                                    setChecked={() => onChangeAvailability(index, item.isOpen)}
                                                                />
                                                                <Text>{item.day}</Text>
                                                                {item.isOpen &&
                                                                    <TouchableOpacity onPress={() => onOpenTimeTicker(index)}>
                                                                        <Text>{hours[item.open]} - {hours[item.close]}</Text>
                                                                    </TouchableOpacity>
                                                                }
                                                            </View>
                                                        )
                                                    })}
                                                    <TouchableOpacity onPress={previousScreen}>
                                                        <Text>Previous screen</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    }}
                                </Formik>
                            </ScrollView>
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
                                        onSubmit={(values) => onRegisterVisitor(values)}
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
            <TimePicker
                bottomSheetRef={timePickerRef}
                open={open}
                setOpen={setOpen}
                close={close}
                setClose={setClose}
                openHours={openHours}
                setOpenHours={setOpenHours}
                index={index}
            />
        </>
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