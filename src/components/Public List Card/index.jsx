import React, { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { darkTheme, lightTheme } from '../../utils/themes';
import { GlobalContext } from '../../utils/context';

const PublicListCard = ({ name, length, user }) => {
    const navigation = useNavigation();
    const { theme } = useContext(GlobalContext);

    const onNavigate = () => {
        navigation.navigate('SavedMap', { list: name, user: user });
    }

    const renderAmount = () => {
        switch (length) {
            case 0:
                return 'Empty list';
            case 1:
                return 'One place';
            default:
                return `${length} Places`;
        }
    }

    return (
        <TouchableOpacity
            onPress={onNavigate}
            style={styles.container}
            activeOpacity={0.85}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={require('../../../assets/images/list-doodle.png')}
                    style={styles.image}
                    resizeMode='cover'
                />
            </View>
            <View style={[styles.details, styles[`details${theme}`]]}>
                <Text style={[styles.text, styles.name, styles[`text${theme}`]]}>{name}</Text>
                <Text style={[styles.text, styles[`text${theme}`]]}>{renderAmount()}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default PublicListCard;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 170,
        borderRadius: 15,
        elevation: 2,
        overflow: 'hidden',
        marginBottom: 15
    },
    imageWrapper: {
        width: '100%',
        height: '70%'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    details: {
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1
    },
    detailsLight: {
        backgroundColor: lightTheme.box,
        borderTopColor: 'rgba(0, 0, 0, 0.2)'
    },
    detailsDark: {
        backgroundColor: darkTheme.box,
        borderTopColor: 'rgba(255, 255, 255, 0.2)'
    },
    text: {
        fontFamily: 'Quicksand',
        transform: [{ translateY: -1.5 }]
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    name: {
        textTransform: 'capitalize'
    }
});