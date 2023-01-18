import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Slider } from '@miblanchard/react-native-slider';
import { GlobalContext } from '../../utils/context';
import Checkbox from '../Checkbox';

const FilterPanel = ({
    // setTriggerFilter,
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
    setIsOpenNow,
    prices,
    setPrices
}) => {
    const { onTriggerFilter } = useContext(GlobalContext);

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
    }

    const onApplyFilters = () => {
        onTriggerFilter(true);
        closeBottomSheet();
    }

    const onResetFilters = () => {
        closeBottomSheet();
        onTriggerFilter(true);
        setFoodTruck(false);
        setCoffeeCart(false);
        setIsKosher(false);
        setIsOpenOnSaturday(false);
        setIsVegetarian(false);
        setIsVegan(false);
        setIsGlutenFree(false);
        setIsOpenNow(false);
        setPrices([1, 1000]);
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
                    <Text>Prices: {prices[0]}-{prices[1]}</Text>
                    <Slider
                        value={prices}
                        onValueChange={(value) => setPrices(value)}
                        minimumValue={1}
                        maximumValue={1000}
                        step={1}
                        // onSlidingComplete={() => onSlidingComplete('ages')}
                        thumbTintColor="#5F7ADB"
                        maximumTrackTintColor="#d3d3d3"
                        // minimumTrackTintColor={lightMode.primary}
                        trackClickable
                        animateTransitions
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