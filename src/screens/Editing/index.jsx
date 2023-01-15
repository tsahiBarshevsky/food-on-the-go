import React, { useState, useRef, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import update from 'immutability-helper';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Checkbox, TimePicker } from '../../components';
import { hours } from '../../utils/constants';
import { editRestaurant } from '../../redux/actions/restaurants';
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
import { db } from '../../utils/firebase';
import { doc, updateDoc } from 'firebase/firestore/lite';

const EditingScreen = ({ route }) => {
    const { restaurant } = route.params;
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(0);
    const [close, setClose] = useState(0);
    const [openHours, setOpenHours] = useState(restaurant.openingHours);
    const [image, setImage] = useState(restaurant.image.url);
    const [disabled, setDisabled] = useState(false);
    const location = useSelector(state => state.location);
    const restaurants = useSelector(state => state.restaurants);
    const navigation = useNavigation();

    // Boolean states
    const [kosher, setKosher] = useState(restaurant.kosher);
    const [vegetarian, setVegetarian] = useState(restaurant.vegetarian);
    const [vegan, setVegan] = useState(restaurant.vegan);
    const [glutenFree, setGlutenFree] = useState(restaurant.glutenFree);
    const [restaurantType, setRestaurantType] = useState({
        foodTruck: restaurant.type === 'Food Truck' ? true : false,
        coffeeCart: restaurant.type === 'Coffee Cart' ? true : false
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

    // Initial values
    const initialValues = {
        name: restaurant.name,
        description: restaurant.description,
        link: restaurant.link,
        phone: restaurant.phone,
        priceRange: {
            lowest: restaurant.priceRange.lowest,
            highest: restaurant.priceRange.highest
        }
    };

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

    const handleAddDocument = async (editedRestaurant) => {
        const restaurantRef = doc(db, "restaurants", restaurant.id);
        try {
            // Update document on Firestore
            await updateDoc(restaurantRef, {
                name: editedRestaurant.name,
                description: editedRestaurant.description,
                link: editedRestaurant.link,
                type: editedRestaurant.type,
                phone: editedRestaurant.phone,
                kosher: editedRestaurant.kosher,
                vegetarian: editedRestaurant.vegetarian,
                vegan: editedRestaurant.vegan,
                glutenFree: editedRestaurant.glutenFree,
                priceRange: editedRestaurant.priceRange,
                openingHours: editedRestaurant.openingHours,
                location: editedRestaurant.location
            });
        }
        catch (error) {
            console.log(error.message);
            setDisabled(false);
        }
        finally {
            const index = restaurants.findIndex((item) => item.id === restaurant.id);
            dispatch(editRestaurant(index, editedRestaurant)); // Update store
            dispatch({ type: 'SET_OWNED_RESTAURANT', ownedRestaurant: editedRestaurant }); // Update store
            navigation.goBack();
        }
    }

    const onEditRestaurant = (values) => {
        const { description, link, name, phone, priceRange } = values;
        // setDisabled(true);
        const editedRestaurant = {
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
            openingHours: openHours,
            location: location
        };
        if (image.includes('cloudinary')) {// Image hasn't changed
            editedRestaurant.image = image;
            handleAddDocument(editedRestaurant);
        }
        else {
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
                    editedRestaurant.image = {
                        url: data.url,
                        public_id: data.public_id
                    };
                    handleAddDocument(editedRestaurant);
                })
                .catch((error) => {
                    console.log("error while upload image:", error.message)
                    setDisabled(false);
                });
        }
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
                            initialValues={initialValues}
                            enableReinitialize
                            onSubmit={(values) => onEditRestaurant(values)}
                            innerRef={formRef}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                                return (
                                    <View>
                                        <View style={styles.header}>
                                            {!image ?
                                                <TouchableOpacity onPress={pickImage}>
                                                    <Text>Pick image</Text>
                                                    <MaterialCommunityIcons name="image-plus" size={24} color="black" />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity
                                                    onPress={pickImage}
                                                    style={styles.image}
                                                >
                                                    <Image source={{ uri: image }} style={styles.image} />
                                                </TouchableOpacity>
                                            }
                                        </View>
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
                                <Text>Save changes</Text>
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

export default EditingScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 20
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 200,
        marginVertical: 10,
        backgroundColor: 'royalblue',
        borderRadius: 15,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
});