import React, { useEffect, useState, useContext, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
import { GlobalContext } from '../../utils/context';
import { updateImage } from '../../redux/actions/user';
import { removeRestaurant } from '../../redux/actions/restaurants';
import { resetOwnedRestaurant } from '../../redux/actions/ownedRestaurant';
import { clearHistory } from '../../redux/actions/hisorty';
import { background } from '../../utils/theme';
import { AppearancePanelRef, MinimalReviewCard } from '../../components';
import globalStyles from '../../utils/globalStyles';
import { CLOUDINARY_KEY } from '@env';

// firebase
import { updateProfile, signOut } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import { authentication, db } from '../../utils/firebase';
import { clearHistoryInStorage } from '../../utils/AsyncStorageManagement';

const AVATAR_SIZE = 90;

const ProfileScreen = () => {
    const { theme } = useContext(GlobalContext);
    const [userReviews, setUserReviews] = useState([]);
    const [isUsinSystemScheme, setIsUsinSystemScheme] = useState('false');
    const appearancePanelRef = useRef(null);
    const user = useSelector(state => state.user);
    const ownedRestaurant = useSelector(state => state.ownedRestaurant);
    const restaurants = useSelector(state => state.restaurants);
    const currentUser = authentication.currentUser;
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const uploadImageToCloudinray = async (data) => {
        ToastAndroid.show('Upload has started', ToastAndroid.SHORT);
        return fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_KEY}/image/upload`, {
            method: 'POST',
            body: data
        })
            .then((res) => res.json())
            .then((res) => {
                return res.url;
            })
            .catch((error) => {
                console.log("error while upload image:", error.message)
            });
    }

    const onUploadNewImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            const newFile = {
                uri: result.assets[0].uri,
                type: `test/${result.assets[0].uri.split(".")[1]}`,
                name: `test.${result.assets[0].uri.split(".")[1]}`
            }
            const data = new FormData();
            data.append('file', newFile);
            data.append('upload_preset', 'foodOnTheGo');
            data.append('folder', 'Food on the go images');
            data.append('cloud_name', CLOUDINARY_KEY);
            uploadImageToCloudinray(data).then(async (res) => {
                updateProfile(currentUser, { photoURL: res }); // Update profile in firebase
                const userRef = doc(db, "users", currentUser.uid);
                try {
                    await updateDoc(userRef, { image: res });
                }
                catch (error) {
                    console.log('error', error.message);
                }
                finally {
                    dispatch(updateImage(res)); // Update store
                }
            });
        }
    }

    const onRemoveRestaurant = async () => {
        try {
            await deleteDoc(doc(db, "restaurants", ownedRestaurant.id));
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            const index = restaurants.findIndex((item) => item.id === ownedRestaurant.id);
            dispatch(removeRestaurant(index)); // Update store
            dispatch(resetOwnedRestaurant()); // Reset owned restaurant to initial state
        }
    }

    const onSignOut = () => {
        signOut(authentication).then(() => {
            dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: false });
        }).catch((e) => {
            console.log(e)
        });
    }

    const onClearSearchHistory = () => {
        clearHistoryInStorage();
        dispatch(clearHistory());
        ToastAndroid.show('History cleared', ToastAndroid.SHORT);
    }

    useEffect(() => {
        const myReviews = [...restaurants].filter((item) => item.reviews.some((review) => review.user.uid === currentUser.uid));
        const arr = [];
        myReviews.forEach((item) => {
            const review = item.reviews.find((review) => review.user.uid === currentUser.uid);
            arr.push({ id: item.id, name: item.name, type: item.type, city: item.location.city, review: review })
        });
        setUserReviews(arr);
    }, [restaurants]);

    return (
        <>
            <View style={globalStyles.container}>
                <View style={styles.header}>
                    <View style={styles.avatarWrapper}>
                        <TouchableOpacity
                            onPress={onUploadNewImage}
                            style={styles.camera}
                        >
                            <FontAwesome name="camera" size={13} color="white" />
                        </TouchableOpacity>
                        <View style={styles.avatar}>
                            {currentUser.photoURL ?
                                <Image
                                    source={{ uri: currentUser.photoURL }}
                                    style={styles.image}
                                />
                                :
                                <Text style={styles.letter}>
                                    {currentUser.displayName.charAt(0)}
                                </Text>
                            }
                        </View>
                    </View>
                    <Text>{currentUser.displayName}</Text>
                    <Text>{currentUser.email}</Text>
                    <Text>{theme}</Text>
                </View>
                {/* <Text style={styles.title}>Restaurants I've been reviewd ({userReviews.length})</Text>
                <FlatList
                    data={userReviews}
                    keyExtractor={(item) => item.id}
                    style={{ flexGrow: 0 }}
                    renderItem={({ item }) => {
                        return (
                            <MinimalReviewCard
                                restaurant={item}
                                review={item.review}
                            />
                        )
                    }}
                />
                <Text>{user.type}</Text>
                <TouchableOpacity onPress={onSignOut}>
                    <Text>Sign out</Text>
                </TouchableOpacity>
                {Object.keys(ownedRestaurant).length === 0 ?
                    <TouchableOpacity onPress={() => navigation.navigate('Insertion')}>
                        <Text>Add new restaurant</Text>
                    </TouchableOpacity>
                    :
                    <View>
                        <Text>My restaurant: {ownedRestaurant.name}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Editing', { restaurant: ownedRestaurant })}>
                            <Text>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onRemoveRestaurant}>
                            <Text>Delete</Text>
                        </TouchableOpacity>
                    </View>
                } */}
                <View>
                    <Text style={styles.title}>Settings</Text>
                    <TouchableOpacity
                        onPress={() => appearancePanelRef.current?.open()}
                        style={styles.settings}
                    >
                        <View style={styles.wrapper}>
                            <View style={styles.iconWrapper}>
                                <MaterialCommunityIcons name="theme-light-dark" size={18} color="#80adce" />
                            </View>
                            <Text style={styles.settingsTitle}>Appearance</Text>
                        </View>
                        <View style={styles.wrapper}>
                            <Text style={styles.theme}>
                                {isUsinSystemScheme === 'true' ? 'System' : theme}
                            </Text>
                            <Entypo name="chevron-small-right" size={20} color="grey" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onClearSearchHistory}
                        style={styles.settings}
                    >
                        <View style={styles.wrapper}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="history" size={18} color="black" />
                            </View>
                            <Text style={styles.settingsTitle}>Clear Search History</Text>
                        </View>
                        <Entypo name="chevron-small-right" size={20} color="grey" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onSignOut}
                        style={styles.settings}
                    >
                        <View style={styles.wrapper}>
                            <View style={styles.iconWrapper}>
                                <AntDesign name="logout" size={15} color="black" />
                            </View>
                            <Text style={styles.settingsTitle}>Sign Out</Text>
                        </View>
                        <Entypo name="chevron-small-right" size={20} color="grey" />
                    </TouchableOpacity>
                </View>
            </View>
            <AppearancePanelRef
                bottomSheetRef={appearancePanelRef}
                isUsinSystemScheme={isUsinSystemScheme}
                setIsUsinSystemScheme={setIsUsinSystemScheme}
            />
        </>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 1.5,
        borderColor: 'black',
        marginBottom: 10
    },
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: AVATAR_SIZE - 8,
        height: AVATAR_SIZE - 8,
        borderRadius: (AVATAR_SIZE - 8) / 2,
        backgroundColor: 'royalblue',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: (AVATAR_SIZE - 8) / 2
    },
    letter: {
        fontSize: 55,
        fontWeight: 'bold',
        color: background,
        textTransform: 'uppercase',
        transform: [{ translateY: -1 }]
    },
    camera: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 14,
        bottom: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'black'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    settings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    settingsTitle: {
        transform: [{ translateY: -1.5 }]
    },
    iconWrapper: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginRight: 10
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    theme: {
        color: 'grey',
        transform: [{ translateY: -1.5 }],
        marginRight: 5
    }
});