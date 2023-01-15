import React, { useState, useRef, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import update from 'immutability-helper';
import uuid from 'react-native-uuid';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Checkbox, TimePicker } from '../../components';
import { hours, restaurant, schedule } from '../../utils/constants';
import { addNewRestaurant } from '../../redux/actions/restaurants';
import globalStyles from '../../utils/globalStyles';
import { CLOUDINARY_KEY } from '@env';

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
    Keyboard,
    Image
} from 'react-native';

// Firebase
import { authentication, db } from '../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore/lite';

const InsertionScreen = () => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(0);
    const [close, setClose] = useState(0);
    const [openHours, setOpenHours] = useState(schedule);
    const [image, setImage] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const location = useSelector(state => state.location);
    const navigation = useNavigation();

    // Boolean states
    const [kosher, setKosher] = useState(false);
    const [vegetarian, setVegetarian] = useState(false);
    const [vegan, setVegan] = useState(false);
    const [glutenFree, setGlutenFree] = useState(false);
    const [restaurantType, setRestaurantType] = useState({
        foodTruck: true,
        coffeeCart: false
    });

    // Refs
    const timePickerRef = useRef(null);
    const formRef = useRef(null);
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const linkRef = useRef(null);
    const phoneRef = useRef(null);
    const lowestRef = useRef(null);
    const highestRef = useRef(null);

    // Redux dispatch
    const dispatch = useDispatch();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled)
            setImage(result.assets[0].uri);
    }

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

    const handleAddDocument = async (newRestaurant) => {
        try {
            await setDoc(doc(db, 'restaurants', newRestaurant.id), newRestaurant); // Add new doc
        }
        catch (error) {
            console.log(error.message);
            setDisabled(false);
        }
        finally {
            dispatch(addNewRestaurant(newRestaurant)); // Update store
            dispatch({ type: 'SET_OWNED_RESTAURANT', ownedRestaurant: newRestaurant }); // Update store
            navigation.goBack();
        }
    }

    const onAddNewRestaurant = (values) => {
        const { description, link, name, phone, priceRange } = values;
        setDisabled(true);
        const newRestaurant = {
            id: uuid.v4(),
            owner: authentication.currentUser.uid,
            name: name,
            description: description,
            link: link,
            type: restaurantType.foodTruck ? "Food Truck" : "Coffee Cart",
            phone: phone,
            kosher: kosher,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            priceRange: priceRange,
            reviews: [],
            openingHours: openHours,
            location: location
        };
        const newFile = {
            uri: image,
            type: `test/${image.split(".")[1]}`,
            name: `test.${image.split(".")[1]}`
        }
        const data = new FormData();
        data.append('file', newFile);
        data.append('upload_preset', 'foodOnTheGo');
        data.append('folder', 'Food on the go images');
        data.append('cloud_name', CLOUDINARY_KEY);
        fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_KEY}/image/upload`, {
            method: 'POST',
            body: data
        })
            .then((res) => res.json())
            .then((data) => {
                newRestaurant.image = {
                    url: data.url,
                    public_id: data.public_id
                };
                handleAddDocument(newRestaurant);
            })
            .catch((error) => {
                console.log("error while upload image:", error.message)
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
        <>
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
                            initialValues={restaurant}
                            enableReinitialize
                            onSubmit={(values) => onAddNewRestaurant(values)}
                            innerRef={formRef}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                                return (
                                    <View>
                                        <TouchableOpacity onPress={pickImage}>
                                            <Text>Pick image</Text>
                                        </TouchableOpacity>
                                        <Image source={{ uri: image }} style={styles.image} resizeMode='cover' />
                                        <Text style={styles.title}>Name and type</Text>
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
                                        <Text style={styles.title}>About</Text>
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
                                                onChangeText={handleChange('phone')}
                                                underlineColorAndroid="transparent"
                                                // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                maxLength={10}
                                                returnKeyType='next'
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('phone')}
                                                onSubmitEditing={() => lowestRef?.current.focus()}
                                                style={styles.textInput}
                                            />
                                        </View>
                                        <Text style={styles.title}>Menu</Text>
                                        <View style={styles.textInputWrapper}>
                                            <TextInput
                                                placeholder='Lowest...'
                                                value={values.priceRange.lowest}
                                                ref={lowestRef}
                                                keyboardType='number-pad'
                                                onChangeText={handleChange('priceRange.lowest')}
                                                underlineColorAndroid="transparent"
                                                // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                returnKeyType='next'
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('priceRange.lowest')}
                                                onSubmitEditing={() => highestRef?.current.focus()}
                                                style={styles.textInput}
                                            />
                                        </View>
                                        <View style={styles.textInputWrapper}>
                                            <TextInput
                                                placeholder='Highest...'
                                                value={values.priceRange.highest}
                                                ref={highestRef}
                                                keyboardType='number-pad'
                                                onChangeText={handleChange('priceRange.highest')}
                                                underlineColorAndroid="transparent"
                                                // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                                                onBlur={handleBlur('priceRange.highest')}
                                                onSubmitEditing={handleSubmit}
                                                style={styles.textInput}
                                            />
                                        </View>
                                        <Checkbox
                                            checked={kosher}
                                            setChecked={() => setKosher(!kosher)}
                                            caption='Kosher'
                                        />
                                        <Checkbox
                                            checked={vegetarian}
                                            setChecked={() => setVegetarian(!vegetarian)}
                                            caption='Vegetarian'
                                        />
                                        <Checkbox
                                            checked={vegan}
                                            setChecked={() => setVegan(!vegan)}
                                            caption='Vegan'
                                        />
                                        <Checkbox
                                            checked={glutenFree}
                                            setChecked={() => setGlutenFree(!glutenFree)}
                                            caption='Gluten free'
                                        />
                                        <Text style={styles.title}>Openings hours</Text>
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
                                        </View>
                                    </View>
                                )
                            }}
                        </Formik>
                        <TouchableOpacity
                            onPress={() => formRef.current?.handleSubmit()}
                            disabled={disabled}
                        >
                            {disabled ?
                                <Text>...</Text>
                                :
                                <Text>Save</Text>
                            }
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
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

export default InsertionScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 20
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 10
    }
});