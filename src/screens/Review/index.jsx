import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import globalStyles from '../../utils/globalStyles';

const ReviewScreen = ({ route }) => {
    const { rating } = route.params;
    return (
        <View style={globalStyles.container}>
            <Text>{rating}</Text>
        </View>
    )
}

export default ReviewScreen;

const styles = StyleSheet.create({});