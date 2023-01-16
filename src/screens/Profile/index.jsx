import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { removeRestaurant } from '../../redux/actions/restaurants';
import { resetOwnedRestaurant } from '../../redux/actions/ownedRestaurant';
import globalStyles from '../../utils/globalStyles';

// firebase
// firebase
import { signOut } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore/lite';
import { authentication, db } from '../../utils/firebase';

const ProfileScreen = () => {
    const user = useSelector(state => state.user);
    const ownedRestaurant = useSelector(state => state.ownedRestaurant);
    const restaurants = useSelector(state => state.restaurants);
    const navigation = useNavigation();
    const dispatch = useDispatch();

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
        console.log(authentication.currentUser.email);
        signOut(authentication).then(() => {
            dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: false });
        }).catch((e) => {
            console.log(e)
        });
    }

    return (
        <View style={globalStyles.container}>
            <Text>{authentication.currentUser.email}</Text>
            <Text>{authentication.currentUser.displayName}</Text>
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
            }
        </View>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({});