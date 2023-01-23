import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { GlobalContext } from '../../utils/context';
import { updateIsUsingSystemScheme } from '../../utils/AsyncStorageManagement';

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
                modalStyle={styles.modalStyle}
                openAnimationConfig={{ timing: { duration: 200 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
                useNativeDriver
            >
                <View style={styles.bottomSheetContainer}>
                    <Text>Select Theme</Text>
                    <TouchableOpacity
                        onPress={() => onChangeTheme('Light')}
                        style={styles.item}
                    >
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <Ionicons name="sunny" size={20} color="#4587d0" />
                            </View>
                            <Text style={styles.title}>Light</Text>
                        </View>
                        {theme === 'Light' && isUsinSystemScheme === 'false' &&
                            <AntDesign name="check" size={17} color='black' />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onChangeTheme('Dark')}
                        style={styles.item}
                    >
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <Ionicons name="moon" size={20} color="#f08e08" />
                            </View>
                            <Text style={styles.title}>Dark</Text>
                        </View>
                        {theme === 'Dark' && isUsinSystemScheme === 'false' &&
                            <AntDesign name="check" size={17} color='black' />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onChangeTheme('System')}
                        style={styles.item}
                    >
                        <View style={styles.iconAndCaption}>
                            <View style={styles.icon}>
                                <Ionicons name="settings-sharp" size={20} color="#5f7177" />
                            </View>
                            <Text style={styles.title}>System</Text>
                        </View>
                        {isUsinSystemScheme === 'true' &&
                            <AntDesign name="check" size={17} color={styles[`mark${theme}`]} />
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
        paddingVertical: 15
    },
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
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
        textTransform: 'capitalize'
    }
});