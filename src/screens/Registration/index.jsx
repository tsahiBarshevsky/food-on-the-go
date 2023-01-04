import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { API_KEY } from '@env';

const RegistrationScreen = () => {
    return (
        <View>
            <Text>{API_KEY}</Text>
        </View>
    )
}

export default RegistrationScreen;

const styles = StyleSheet.create({});