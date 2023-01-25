import React, { useEffect, useState, useContext, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, FlatList, ToastAndroid, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalContext } from '../../utils/context';
import { updateImage } from '../../redux/actions/user';
import { removeRestaurant } from '../../redux/actions/restaurants';
import { resetOwnedRestaurant } from '../../redux/actions/ownedRestaurant';
import { clearHistory } from '../../redux/actions/hisorty';
import { AppearancePanel, MinimalReviewCard } from '../../components';
import { clearHistoryInStorage } from '../../utils/AsyncStorageManagement';
import { CLOUDINARY_KEY } from '@env';

import globalStyles from '../../utils/globalStyles';
import Header from './header';
import Footer from './footer';

// firebase
import { updateProfile, signOut } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import { authentication, db } from '../../utils/firebase';

const ProfileScreen = () => {
    const { theme, isUsinSystemScheme, onTriggerFilter } = useContext(GlobalContext);
    const [userReviews, setUserReviews] = useState([]);
    const appearancePanelRef = useRef(null);
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
            await deleteDoc(doc(db, "restaurants", ownedRestaurant.id)); // Add new doc
            const index = restaurants.findIndex((item) => item.id === ownedRestaurant.id);
            dispatch(removeRestaurant(index)); // Update store
            dispatch(resetOwnedRestaurant()); // Reset owned restaurant to initial state
            onTriggerFilter(true);
        }
        catch (error) {
            console.log(error.message);
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

    // props
    const headerProps = {
        navigation,
        userReviews,
        currentUser,
        onUploadNewImage,
        ownedRestaurant,
        onRemoveRestaurant
    };
    const footerProps = {
        navigation,
        userReviews,
        appearancePanelRef,
        isUsinSystemScheme,
        onClearSearchHistory,
        onSignOut
    };

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
                <FlatList
                    data={userReviews.slice(0, 2)}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={<Header {...headerProps} />}
                    ListFooterComponent={<Footer {...footerProps} />}
                    ItemSeparatorComponent={<View style={[styles.separator, styles[`separator${theme}`]]} />}
                    contentContainerStyle={styles.flatlist}
                    renderItem={({ item }) => {
                        return (
                            <MinimalReviewCard
                                restaurant={item}
                                review={item.review}
                            />
                        )
                    }}
                />
            </View>
            <AppearancePanel bottomSheetRef={appearancePanelRef} />
        </>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    flatlist: {
        paddingHorizontal: 15
    },
    separator: {
        width: '100%',
        height: 1,
        marginVertical: 15
    },
    separatorLight: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    separatorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    }
});