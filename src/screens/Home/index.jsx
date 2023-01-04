import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';
import globalStyles from '../../utils/globalStyles';

const HomeScreen = () => {
    const navigation = useNavigation();

    const onSignOut = () => {
        signOut(authentication);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        })
    }

    return (
        <View style={globalStyles.container}>
            <Text>Welcome, {authentication.currentUser.email}</Text>
            <TouchableOpacity onPress={onSignOut}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({});