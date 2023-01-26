import React, { useState, useRef, useEffect, useContext } from 'react';
import * as ImagePicker from 'expo-image-picker';
import update from 'immutability-helper';
import uuid from 'react-native-uuid';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Checkbox, TimePicker } from '../../components';
import { hours, restaurant, schedule } from '../../utils/constants';
import { GlobalContext } from '../../utils/context';
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
import { darkTheme, lightTheme } from '../../utils/themes';

const InsertionScreen = () => {
    const { theme, onTriggerFilter } = useContext(GlobalContext);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(0);
    const [close, setClose] = useState(0);
    const [openHours, setOpenHours] = useState(schedule);
    const [image, setImage] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [chosenDay, setChosenDay] = useState(null);
    const location = useSelector(state => state.location);
    const navigation = useNavigation();

    // Boolean states
    const [accessible, setAccessible] = useState(false);
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

    const onChangeAvailability = (day, index, status) => {
        const newArray = update(openHours, {
            [index]: {
                $merge: { isOpen: !status }
            }
        });
        setOpenHours(newArray);
        if (!status)
            onOpenTimeTicker(day, index);
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

    const onOpenTimeTicker = (day, index) => {
        setIndex(index);
        setChosenDay(day);
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
            dispatch(addNewRestaurant(newRestaurant)); // Update store
            dispatch({ type: 'SET_OWNED_RESTAURANT', ownedRestaurant: newRestaurant }); // Update store
            onTriggerFilter(true);
            navigation.goBack();
        }
        catch (error) {
            console.log(error.message);
            setDisabled(false);
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
            accessible: accessible,
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
                    contentContainerStyle={styles.scrollView}
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
                                        {!image ?
                                            <TouchableOpacity
                                                onPress={pickImage}
                                                style={[styles.header, styles[`header${theme}`]]}
                                                activeOpacity={0.85}
                                            >
                                                <Text style={[styles.text, styles.caption, styles[`text${theme}`]]}>
                                                    Select image
                                                </Text>
                                                <MaterialCommunityIcons name="image-plus" size={22} color={theme === 'Light' ? "black" : "white"} />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                onPress={pickImage}
                                                style={styles.header}
                                                activeOpacity={0.85}
                                            >
                                                <Image source={{ uri: image }} style={styles.image} />
                                            </TouchableOpacity>
                                        }
                                        <Text style={[styles.text, styles.title, styles[`text${theme}`]]}>
                                            Name and type
                                        </Text>
                                        <View
                                            style={[
                                                globalStyles.textInputWrapper,
                                                globalStyles[`textInputWrapper${theme}`]
                                            ]}
                                        >
                                            <TextInput
                                                placeholder='Name...'
                                                value={values.name}
                                                ref={nameRef}
                                                onChangeText={handleChange('name')}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('name')}
                                                returnKeyType='next'
                                                onSubmitEditing={() => descriptionRef.current?.focus()}
                                                style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                                            />
                                        </View>
                                        <View>
                                            <Checkbox
                                                checked={restaurantType.foodTruck}
                                                setChecked={() => onChageRestaurantType('foodTruck')}
                                                caption="Food Truck"
                                                withCaption
                                            />
                                            <Checkbox
                                                checked={restaurantType.coffeeCart}
                                                setChecked={() => onChageRestaurantType('coffeeCart')}
                                                caption="Coffee Cart"
                                                withCaption
                                            />
                                        </View>
                                        <Text style={[styles.text, styles.title, styles[`text${theme}`]]}>
                                            About
                                        </Text>
                                        <View
                                            style={[
                                                globalStyles.textInputWrapper,
                                                globalStyles[`textInputWrapper${theme}`]
                                            ]}
                                        >
                                            <TextInput
                                                placeholder='Description...'
                                                value={values.description}
                                                ref={descriptionRef}
                                                onChangeText={handleChange('description')}
                                                multiline
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('description')}
                                                returnKeyType='next'
                                                onSubmitEditing={() => linkRef.current?.focus()}
                                                style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                                            />
                                        </View>
                                        <View
                                            style={[
                                                globalStyles.textInputWrapper,
                                                globalStyles[`textInputWrapper${theme}`]
                                            ]}
                                        >
                                            <TextInput
                                                placeholder='Link...'
                                                value={values.link}
                                                ref={linkRef}
                                                onChangeText={handleChange('link')}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('link')}
                                                returnKeyType='next'
                                                onSubmitEditing={() => phoneRef.current?.focus()}
                                                style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                                            />
                                        </View>
                                        <View
                                            style={[
                                                globalStyles.textInputWrapper,
                                                globalStyles[`textInputWrapper${theme}`]
                                            ]}
                                        >
                                            <TextInput
                                                placeholder='Phone number...'
                                                value={values.phone}
                                                ref={phoneRef}
                                                keyboardType='number-pad'
                                                onChangeText={handleChange('phone')}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                maxLength={10}
                                                returnKeyType='next'
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('phone')}
                                                onSubmitEditing={() => lowestRef?.current.focus()}
                                                style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                                            />
                                        </View>
                                        <Checkbox
                                            checked={accessible}
                                            setChecked={() => setAccessible(!accessible)}
                                            caption='Handicapped accessible'
                                            withCaption
                                        />
                                        <Text style={[styles.text, styles.title, styles[`text${theme}`]]}>
                                            Menu
                                        </Text>
                                        <View
                                            style={[
                                                globalStyles.textInputWrapper,
                                                globalStyles[`textInputWrapper${theme}`]
                                            ]}
                                        >
                                            <TextInput
                                                placeholder='Lowest dish in the menu...'
                                                value={values.priceRange.lowest}
                                                ref={lowestRef}
                                                keyboardType='number-pad'
                                                onChangeText={handleChange('priceRange.lowest')}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                returnKeyType='next'
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('priceRange.lowest')}
                                                onSubmitEditing={() => highestRef?.current.focus()}
                                                style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                                            />
                                        </View>
                                        <View
                                            style={[
                                                globalStyles.textInputWrapper,
                                                globalStyles[`textInputWrapper${theme}`]
                                            ]}
                                        >
                                            <TextInput
                                                placeholder='Highest dish in the menu...'
                                                value={values.priceRange.highest}
                                                ref={highestRef}
                                                keyboardType='number-pad'
                                                onChangeText={handleChange('priceRange.highest')}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                selectionColor={theme === 'Light' ? lightTheme.placeholder : darkTheme.placeholder}
                                                onBlur={handleBlur('priceRange.highest')}
                                                onSubmitEditing={handleSubmit}
                                                style={[globalStyles.textInput, globalStyles[`textInput${theme}`]]}
                                            />
                                        </View>
                                        <Checkbox
                                            checked={kosher}
                                            setChecked={() => setKosher(!kosher)}
                                            caption='Kosher'
                                            withCaption
                                        />
                                        <Checkbox
                                            checked={vegetarian}
                                            setChecked={() => setVegetarian(!vegetarian)}
                                            caption='Vegetarian'
                                            withCaption
                                        />
                                        <Checkbox
                                            checked={vegan}
                                            setChecked={() => setVegan(!vegan)}
                                            caption='Vegan'
                                            withCaption
                                        />
                                        <Checkbox
                                            checked={glutenFree}
                                            setChecked={() => setGlutenFree(!glutenFree)}
                                            caption='Gluten free'
                                            withCaption
                                        />
                                        <Text style={[styles.text, styles.title, styles[`text${theme}`]]}>
                                            Openings hours
                                        </Text>
                                        <View>
                                            {openHours.map((item, index) => {
                                                return (
                                                    <View key={index} style={styles.dayItem}>
                                                        <View style={styles.day}>
                                                            <View style={styles.checkbox}>
                                                                <Checkbox
                                                                    checked={item.isOpen}
                                                                    setChecked={() => onChangeAvailability(item.day, index, item.isOpen)}
                                                                    withCaption={false}
                                                                />
                                                            </View>
                                                            <Text style={[styles.text, styles[`text${theme}`]]}>
                                                                {item.day}
                                                            </Text>
                                                        </View>
                                                        {item.isOpen ?
                                                            <TouchableOpacity
                                                                onPress={() => onOpenTimeTicker(item.day, index)}
                                                                activeOpacity={0.85}
                                                            >
                                                                <Text style={[styles.text, styles[`text${theme}`]]}>
                                                                    {hours[item.open]} - {hours[item.close]}
                                                                </Text>
                                                            </TouchableOpacity>
                                                            :
                                                            <Text style={[styles.text, styles[`text${theme}`]]}>
                                                                Closed
                                                            </Text>
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
                            style={styles.button}
                            activeOpacity={0.85}
                        >
                            {disabled ?
                                <Text>...</Text>
                                :
                                <Text style={[styles.text, styles.buttonText]}>Save</Text>
                            }
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
            <TimePicker
                bottomSheetRef={timePickerRef}
                chosenDay={chosenDay}
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
    scrollView: {
        paddingBottom: 15,
        paddingHorizontal: 15
    },
    title: {
        fontSize: 20,
        marginBottom: 5
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 15,
        overflow: 'hidden'
    },
    headerLight: {
        backgroundColor: lightTheme.box
    },
    headerDark: {
        backgroundColor: darkTheme.box
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
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
    caption: {
        fontSize: 16,
        marginBottom: 5
    },
    dayItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    day: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    checkbox: {
        marginRight: 10
    },
    button: {
        backgroundColor: lightTheme.icon,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        paddingVertical: 7,
        marginTop: 10,
        elevation: 2
    },
    buttonText: {
        fontSize: 15,
        color: 'white'
    }
});