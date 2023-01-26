import React, { useState, useRef, useEffect, useContext } from 'react';
import * as ImagePicker from 'expo-image-picker';
import update from 'immutability-helper';
import { DotIndicator } from 'react-native-indicators';
import { Formik, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Checkbox, TimePicker } from '../../components';
import { hours } from '../../utils/constants';
import { GlobalContext } from '../../utils/context';
import { editRestaurant } from '../../redux/actions/restaurants';
import globalStyles from '../../utils/globalStyles';
import { darkTheme, lightTheme } from '../../utils/themes';
import { CLOUDINARY_KEY } from '@env';
import { restaurantSchema } from '../../utils/schemas';

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
    const { theme, onTriggerFilter } = useContext(GlobalContext);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(0);
    const [close, setClose] = useState(0);
    const [openHours, setOpenHours] = useState(restaurant.openingHours);
    const [image, setImage] = useState(restaurant.image.url);
    const [disabled, setDisabled] = useState(false);
    const [chosenDay, setChosenDay] = useState(null);
    const location = useSelector(state => state.location);
    const restaurants = useSelector(state => state.restaurants);
    const navigation = useNavigation();

    // Boolean states
    const [accessible, setAccessible] = useState(restaurant.accessible);
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
            lowest: restaurant.priceRange.lowest.toString(),
            highest: restaurant.priceRange.highest.toString()
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
            const index = restaurants.findIndex((item) => item.id === restaurant.id);
            dispatch(editRestaurant(index, editedRestaurant)); // Update store
            dispatch({ type: 'SET_OWNED_RESTAURANT', ownedRestaurant: editedRestaurant }); // Update store
            onTriggerFilter(true);
            navigation.goBack();
        }
        catch (error) {
            console.log(error.message);
            setDisabled(false);
        }
    }

    const onEditRestaurant = (values) => {
        const { description, link, name, phone, priceRange } = values;
        const dup = JSON.parse(JSON.stringify(priceRange));
        dup.lowest = Number(priceRange.lowest);
        dup.highest = Number(priceRange.highest);
        setDisabled(true);
        const editedRestaurant = {
            name: name.trim(),
            description: description,
            link: link,
            type: restaurantType.foodTruck ? "Food Truck" : "Coffee Cart",
            phone: phone,
            accessible: accessible,
            kosher: kosher,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            priceRange: dup,
            openingHours: openHours,
            location: location
        };
        if (image.includes('cloudinary')) { // Image hasn't changed
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
                    contentContainerStyle={styles.scrollView}
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
                            validationSchema={restaurantSchema}
                            validateOnChange={false}
                            validateOnBlur={false}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values }) => {
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
                                                globalStyles[`textInputWrapper${theme}`],
                                                styles.marginTop
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
                                        <ErrorMessage
                                            name='name'
                                            render={(message) => {
                                                return (
                                                    <Text style={[styles.text, globalStyles.error]}>
                                                        {message}
                                                    </Text>
                                                )
                                            }}
                                        />
                                        <View style={styles.marginTop}>
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
                                        <View style={styles.marginTop}>
                                            <Text style={[styles.text, styles.title, styles[`text${theme}`]]}>
                                                About
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                globalStyles.textInputWrapper,
                                                globalStyles[`textInputWrapper${theme}`],
                                                styles.marginTop
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
                                        <ErrorMessage
                                            name='description'
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
                                        <ErrorMessage
                                            name='link'
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
                                        <ErrorMessage
                                            name='phone'
                                            render={(message) => {
                                                return (
                                                    <Text style={[styles.text, globalStyles.error]}>
                                                        {message}
                                                    </Text>
                                                )
                                            }}
                                        />
                                        <View style={styles.marginTop}>
                                            <Checkbox
                                                checked={accessible}
                                                setChecked={() => setAccessible(!accessible)}
                                                caption='Handicapped accessible'
                                                withCaption
                                            />
                                        </View>
                                        <View style={styles.marginTop}>
                                            <Text style={[styles.text, styles.title, styles[`text${theme}`]]}>
                                                Menu
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                globalStyles.textInputWrapper,
                                                globalStyles[`textInputWrapper${theme}`],
                                                styles.marginTop
                                            ]}
                                        >
                                            <TextInput
                                                placeholder='Lowest...'
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
                                        <ErrorMessage
                                            name='priceRange.lowest'
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
                                                placeholder='Highest...'
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
                                        <ErrorMessage
                                            name='priceRange.highest'
                                            render={(message) => {
                                                return (
                                                    <Text style={[styles.text, globalStyles.error]}>
                                                        {message}
                                                    </Text>
                                                )
                                            }}
                                        />
                                        <View style={styles.marginTop}>
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
                                        </View>
                                        <View style={styles.marginTop}>
                                            <Text style={[styles.text, styles.title, styles[`text${theme}`]]}>
                                                Openings hours
                                            </Text>
                                        </View>
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
                                <DotIndicator size={5} count={3} color='white' />
                                :
                                <Text style={[styles.text, styles.buttonText]}>Save changes</Text>
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

export default EditingScreen;

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
        height: 35,
        backgroundColor: lightTheme.icon,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginTop: 10,
        elevation: 2
    },
    buttonText: {
        fontSize: 15,
        color: 'white'
    },
    textInput: {
        marginTop: 10
    },
    marginTop: {
        marginTop: 10
    }
});