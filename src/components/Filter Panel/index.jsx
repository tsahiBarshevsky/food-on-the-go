import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import Checkbox from '../Checkbox';

const FilterPanel = ({
    bottomSheetRef,
    foodTruck,
    setFoodTruck,
    coffeeCart,
    setCoffeeCart,
    setTriggerFilter
}) => {
    const onApplyFilters = () => {
        setTriggerFilter(true);
    }

    const onResetFilters = () => {
        setTriggerFilter(true);
        setFoodTruck(false);
        setCoffeeCart(false);
    }

    const selectType = (type) => {
        if (type === 'foodTruck') {
            setFoodTruck(true);
            setCoffeeCart(false)
        }
        else {
            setFoodTruck(false);
            setCoffeeCart(true)
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
            >
                <View style={styles.bottomSheetContainer}>
                    <TouchableOpacity onPress={onApplyFilters}>
                        <Text>Apply</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onResetFilters}>
                        <Text>Reset</Text>
                    </TouchableOpacity>
                    <Checkbox
                        checked={foodTruck}
                        setChecked={() => selectType('foodTruck')}
                        caption='Food Truck'
                    />
                    <Checkbox
                        checked={coffeeCart}
                        setChecked={() => selectType('coffeeCart')}
                        caption='Coffee Cart'
                    />
                </View>
            </Modalize>
        </Portal>
    )
}

export default FilterPanel;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
});