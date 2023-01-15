import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../utils/globalStyles';

// firebase
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';

const ProfileScreen = () => {
    const navigation = useNavigation();

    const onSignOut = () => {
        signOut(authentication);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        });
    }

    return (
        <View style={globalStyles.container}>
            <Text>{authentication.currentUser.email}</Text>
            <Text>{authentication.currentUser.displayName}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Insertion')}>
                <Text>Add new restaurant</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({});