import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { GlobalContext } from '../../utils/context';
import { updateIsUsingSystemScheme } from '../../utils/AsyncStorageManagement';
import { lightTheme, darkTheme } from '../../utils/themes';

const AppearancePanel = ({ bottomSheetRef }) => {
    const { theme, toggleTheme, isUsinSystemScheme, toggleIsUsinSystemScheme } = useContext(GlobalContext);

    const onChangeTheme = (newTheme) => {
        bottomSheetRef.current?.close();
        toggleTheme(newTheme);
        if (newTheme === 'System') {
            updateIsUsingSystemScheme('true'); // Update AsyncStorage
            toggleIsUsinSystemScheme('true');
        }
        else {
            updateIsUsingSystemScheme('false'); // Update AsyncStorage
            toggleIsUsinSystemScheme('false');
        }
    }

    return (
        <Portal>
            <Modalize
                ref={bottomSheetRef}
                threshold={50}
                adjustToContentHeight
                withHandle={false}
                modalStyle={[styles.modal, styles[`modal${theme}`]]}
                openAnimationConfig={{ timing: { duration: 200 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
                useNativeDriver
            >
                <View style={styles.bottomSheetContainer}>
                    <Text style={[styles.text, styles.title, styles[`text${theme}`]]}>Select Theme</Text>
                    <TouchableOpacity
                        onPress={() => onChangeTheme('Light')}
                        style={styles.item}
                        activeOpacity={1}
                    >
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <Ionicons name="sunny" size={20} color="#f08e08" />
                            </View>
                            <Text style={[styles.text, styles[`text${theme}`]]}>Light</Text>
                        </View>
                        {theme === 'Light' && isUsinSystemScheme === 'false' &&
                            <AntDesign name="check" size={17} style={styles[`mark${theme}`]} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onChangeTheme('Dark')}
                        style={styles.item}
                        activeOpacity={1}
                    >
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <Ionicons name="moon" size={20} color="#4587d0" />
                            </View>
                            <Text style={[styles.text, styles[`text${theme}`]]}>Dark</Text>
                        </View>
                        {theme === 'Dark' && isUsinSystemScheme === 'false' &&
                            <AntDesign name="check" size={17} style={styles[`mark${theme}`]} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onChangeTheme('System')}
                        style={styles.item}
                        activeOpacity={1}
                    >
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <Ionicons name="settings-sharp" size={20} color="#758388" />
                            </View>
                            <Text style={[styles.text, styles[`text${theme}`]]}>System</Text>
                        </View>
                        {isUsinSystemScheme === 'true' &&
                            <AntDesign name="check" size={17} style={styles[`mark${theme}`]} />
                        }
                    </TouchableOpacity>
                </View>
            </Modalize>
        </Portal>
    )
}

export default AppearancePanel;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingHorizontal: 15,
        paddingTop: 15
    },
    modal: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalLight: {
        backgroundColor: lightTheme.background
    },
    modalDark: {
        backgroundColor: darkTheme.background
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        marginVertical: 5
    },
    iconAndCaption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    icon: {
        width: 35,
        height: 30,
        justifyContent: 'center'
    },
    title: {
        fontSize: 15
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
    markLight: {
        color: 'black'
    },
    markDark: {
        color: 'white'
    }
});