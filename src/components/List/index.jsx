import React, { useContext } from 'react';
import moment from 'moment/moment';
import { StyleSheet, Text, View } from 'react-native';
import { hours } from '../../utils/constants';
import { GlobalContext } from '../../utils/context';
import { darkTheme, lightTheme } from '../../utils/themes';

const List = ({ list }) => {
    const { theme } = useContext(GlobalContext);
    const today = moment().format('dddd');

    return (
        <View>
            {list.map((item, index) => {
                return (
                    <View
                        key={item.day}
                        style={[
                            styles.openHour,
                            index < list.length && styles.space
                        ]}
                    >
                        <Text style={[styles.text, styles[`text${theme}`], item.day === today && styles.bold]}>
                            {item.day}
                        </Text>
                        {item.isOpen ?
                            <Text style={[styles.text, styles[`text${theme}`], item.day === today && styles.bold]}>
                                {hours[item.open]} - {hours[item.close]}
                            </Text>
                            :
                            <Text style={[styles.text, styles[`text${theme}`], item.day === today && styles.bold]}>Closed</Text>
                        }
                    </View>
                )
            })}
        </View>
    )
}

export default List;

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Quicksand'
    },
    textLight: {
        color: lightTheme.text
    },
    textDark: {
        color: darkTheme.text
    },
    openHour: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bold: {
        fontFamily: 'QuicksandBold'
    },
    space: {
        marginBottom: 7
    }
});