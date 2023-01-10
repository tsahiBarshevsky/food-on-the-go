import moment from 'moment/moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { hours } from '../../utils/constants';

const List = ({ list }) => {
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
                        <Text style={item.day === today && styles.bold}>
                            {item.day}
                        </Text>
                        {item.isOpen ?
                            <Text style={item.day === today && styles.bold}>
                                {hours[item.open]} - {hours[item.close]}
                            </Text>
                            :
                            <Text style={item.day === today && styles.bold}>Closed</Text>
                        }
                    </View>
                )
            })}
        </View>
    )
}

export default List;

const styles = StyleSheet.create({
    openHour: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bold: {
        fontWeight: 'bold'
    },
    space: {
        marginBottom: 7
    }
});