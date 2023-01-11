import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../utils/globalStyles';

const ReviewScreen = ({ route }) => {
    const { rating } = route.params;
    const navigation = useNavigation();

    return (
        <View style={globalStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Entypo name="chevron-left" size={25} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Post</Text>
                </TouchableOpacity>
            </View>
            <Text>{rating}</Text>
        </View>
    )
}

export default ReviewScreen;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});