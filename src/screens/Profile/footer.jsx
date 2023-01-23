import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
import { GlobalContext } from '../../utils/context';

const Footer = (props) => {
    const { navigation, userReviews, appearancePanelRef, isUsinSystemScheme, onClearSearchHistory, onSignOut } = props;
    const { theme } = useContext(GlobalContext);

    return (
        <View>
            {userReviews.length >= 2 &&
                <TouchableOpacity
                    onPress={() => navigation.navigate('UserReviews', { reviews: userReviews })}
                    style={styles.button}
                >
                    <Text>View all reviews</Text>
                </TouchableOpacity>
            }
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity
                onPress={() => appearancePanelRef.current?.open()}
                style={styles.settings}
            >
                <View style={styles.wrapper}>
                    <View style={styles.iconWrapper}>
                        <MaterialCommunityIcons name="theme-light-dark" size={18} color="#80adce" />
                    </View>
                    <Text style={styles.settingsTitle}>Appearance</Text>
                </View>
                <View style={styles.wrapper}>
                    <Text style={styles.theme}>
                        {isUsinSystemScheme === 'true' ? 'System' : theme}
                    </Text>
                    <Entypo name="chevron-small-right" size={20} color="grey" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onClearSearchHistory}
                style={styles.settings}
            >
                <View style={styles.wrapper}>
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="history" size={18} color="black" />
                    </View>
                    <Text style={styles.settingsTitle}>Clear Search History</Text>
                </View>
                <Entypo name="chevron-small-right" size={20} color="grey" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onSignOut}
                style={styles.settings}
            >
                <View style={styles.wrapper}>
                    <View style={styles.iconWrapper}>
                        <AntDesign name="logout" size={15} color="black" />
                    </View>
                    <Text style={styles.settingsTitle}>Sign Out</Text>
                </View>
                <Entypo name="chevron-small-right" size={20} color="grey" />
            </TouchableOpacity>
        </View>
    )
}

export default Footer

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    settings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    settingsTitle: {
        transform: [{ translateY: -1.5 }]
    },
    iconWrapper: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginRight: 10
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    theme: {
        color: 'grey',
        transform: [{ translateY: -1.5 }],
        marginRight: 5
    },
    button: {
        alignSelf: 'center'
    }
});