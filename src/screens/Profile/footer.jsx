import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

const Footer = (props) => {
    const { navigation, userReviews, appearancePanelRef, isUsinSystemScheme, onClearSearchHistory, onSignOut } = props;
    const { theme } = useContext(GlobalContext);

    return (
        <View>
            {userReviews.length >= 2 &&
                <TouchableOpacity
                    onPress={() => navigation.navigate('UserReviews', { user: 'My', reviews: userReviews })}
                    style={styles.button}
                    activeOpacity={0.85}
                >
                    <Text style={[styles.text, styles.caption, styles[`caption${theme}`]]}>
                        View all {userReviews.length} reviews
                    </Text>
                </TouchableOpacity>
            }
            <Text style={[styles.title, styles[`text${theme}`]]}>Settings</Text>
            <TouchableOpacity
                onPress={() => appearancePanelRef.current?.open()}
                style={styles.settings}
                activeOpacity={1}
            >
                <View style={styles.wrapper}>
                    <View style={[styles.iconWrapper, styles.blue]}>
                        <MaterialCommunityIcons name="theme-light-dark" size={18} color="#80adce" />
                    </View>
                    <Text style={[styles.settingsTitle, styles[`text${theme}`]]}>Appearance</Text>
                </View>
                <View style={styles.wrapper}>
                    <Text style={[styles.theme, styles.text]}>
                        {isUsinSystemScheme === 'true' ? 'System' : theme}
                    </Text>
                    <Entypo name="chevron-small-right" size={20} color="grey" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onClearSearchHistory}
                style={styles.settings}
                activeOpacity={1}
            >
                <View style={styles.wrapper}>
                    <View style={[styles.iconWrapper, styles.green]}>
                        <MaterialIcons name="history" size={18} color="#47a559" />
                    </View>
                    <Text style={[styles.settingsTitle, styles[`text${theme}`]]}>Clear Search History</Text>
                </View>
                <Entypo name="chevron-small-right" size={20} color="grey" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onSignOut}
                style={styles.settings}
                activeOpacity={1}
            >
                <View style={styles.wrapper}>
                    <View style={[styles.iconWrapper, styles.red]}>
                        <AntDesign name="logout" size={14} color="#a54747" />
                    </View>
                    <Text style={[styles.settingsTitle, styles[`text${theme}`]]}>Sign Out</Text>
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
        paddingVertical: 5
    },
    settingsTitle: {
        fontFamily: 'Quicksand',
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
    blue: {
        backgroundColor: '#dbecf5'
    },
    green: {
        backgroundColor: '#dff0dd'
    },
    red: {
        backgroundColor: '#f0dddd'
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    theme: {
        color: 'grey',
        transform: [{ translateY: -2.5 }],
        marginRight: 5
    },
    button: {
        alignSelf: 'center',
        marginVertical: 5
    },
    text: {
        fontFamily: 'Quicksand',
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    caption: {
        fontSize: 16
    },
    captionLight: {
        color: '#1a73e8'
    },
    captionDark: {
        color: '#8cb4f1'
    },
    title: {
        fontSize: 20,
        fontFamily: 'QuicksandBold',
        marginBottom: 5,
        marginTop: 10
    }
});