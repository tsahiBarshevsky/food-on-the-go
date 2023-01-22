import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const StatBox = ({ caption, value }) => {
    return (
        <View style={styles.statBox}>
            <Text>{value}</Text>
            <Text>{caption}</Text>
        </View>
    )
}

export default StatBox;

const styles = StyleSheet.create({
    statBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '33.3%'
    }
});