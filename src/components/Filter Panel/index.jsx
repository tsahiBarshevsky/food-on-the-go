import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import Checkbox from '../Checkbox';

const FilterPanel = ({
    setTriggerFilter,
    bottomSheetRef,
    foodTruck,
    setFoodTruck,
    coffeeCart,
    setCoffeeCart,
    isKosher,
    setIsKosher,
    isOpenOnSaturday,
    setIsOpenOnSaturday,
    isVegetarian,
    setIsVegetarian,
    isVegan,
    setIsVegan,
    isGlutenFree,
    setIsGlutenFree,
    isOpenNow,
    setIsOpenNow
}) => {
    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
    }

    const onApplyFilters = () => {
        setTriggerFilter(true);
        closeBottomSheet();
    }

    const onResetFilters = () => {
        setTriggerFilter(true);
        setFoodTruck(false);
        setCoffeeCart(false);
        setIsKosher(false);
        setIsOpenOnSaturday(false);
        setIsVegetarian(false);
        setIsVegan(false);
        setIsGlutenFree(false);
        setIsOpenNow(false);
        closeBottomSheet();
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
                useNativeDriver
            >
                <View style={styles.bottomSheetContainer}>
                    <TouchableOpacity onPress={onApplyFilters}>
                        <Text>Apply</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onResetFilters}>
                        <Text>Reset</Text>
                    </TouchableOpacity>
                    <Checkbox
                        checked={isOpenNow}
                        setChecked={() => setIsOpenNow(!isOpenNow)}
                        caption='Open now'
                    />
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
                    <Checkbox
                        checked={isKosher}
                        setChecked={() => setIsKosher(!isKosher)}
                        caption='Kosher'
                    />
                    <Checkbox
                        checked={isOpenOnSaturday}
                        setChecked={() => setIsOpenOnSaturday(!isOpenOnSaturday)}
                        caption='Open On Saturdays'
                    />
                    <Checkbox
                        checked={isVegetarian}
                        setChecked={() => setIsVegetarian(!isVegetarian)}
                        caption='Vegetarian'
                    />
                    <Checkbox
                        checked={isVegan}
                        setChecked={() => setIsVegan(!isVegan)}
                        caption='Vegan'
                    />
                    <Checkbox
                        checked={isGlutenFree}
                        setChecked={() => setIsGlutenFree(!isGlutenFree)}
                        caption='Gluten Free'
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