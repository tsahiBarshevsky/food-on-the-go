import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authentication } from '../../utils/firebase';
import globalStyles from '../../utils/globalStyles';

const LoginScreen = () => {
    const [loaded, setLoaded] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user)
                navigation.replace('Home');
            else
                setTimeout(() => {
                    setLoaded(true);
                }, 1000);
        });
        return unsubscribe;
    }, []);

    return loaded ? (
        <View style={globalStyles.container}>
            <Text>LoginScreen</Text>
        </View>
    ) : (
        <View style={globalStyles.container}>
            <Text>Loading...</Text>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({});