import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Slider } from '@miblanchard/react-native-slider';
import { GlobalContext } from '../../utils/context';
import Checkbox from '../Checkbox';

const FilterPanel = (props) => {
    const {
        panelRef,
        foodTruck, setFoodTruck,
        coffeeCart, setCoffeeCart,
        isKosher, setIsKosher,
        isOpenOnSaturday, setIsOpenOnSaturday,
        isVegetarian, setIsVegetarian,
        isVegan, setIsVegan,
        isGlutenFree, setIsGlutenFree,
        isOpenNow, setIsOpenNow,
        prices, setPrices,
        threeStarsRating, setThreeStarsRating,
        fourStarsRating, setFourStarsRating,
        fiveStarsRating, setFiveStarsRating
    } = props;
    const { onTriggerFilter } = useContext(GlobalContext);

    const closeBottomSheet = () => {
        panelRef.current?.close();
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
        setThreeStarsRating(false);
        setFourStarsRating(false);
        setFiveStarsRating(false);
    }

    const onSelectType = (type) => {
        if (type === 'foodTruck') {
            setFoodTruck(!foodTruck);
            setCoffeeCart(false)
        }
        else {
            setFoodTruck(false);
            setCoffeeCart(!coffeeCart)
        }
    }

    const onSelectRating = (rating) => {
        switch (rating) {
            case 'threeStars':
                setThreeStarsRating(!threeStarsRating);
                setFourStarsRating(false);
                setFiveStarsRating(false);
                break;
            case 'fourStars':
                setThreeStarsRating(false);
                setFourStarsRating(!fourStarsRating);
                setFiveStarsRating(false);
                break;
            default:
                setThreeStarsRating(false);
                setFourStarsRating(false);
                setFiveStarsRating(!fiveStarsRating);
        }
    }

    return (
        <Portal>
            <Modalize
                ref={panelRef}
                threshold={50}
                adjustToContentHeight
                withHandle={false}
                modalStyle={styles.modalStyle}
                openAnimationConfig={{ timing: { duration: 200 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
                scrollViewProps={{ showsVerticalScrollIndicator: false }}
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
                        setChecked={() => onSelectType('foodTruck')}
                        caption='Food Truck'
                    />
                    <Checkbox
                        checked={coffeeCart}
                        setChecked={() => onSelectType('coffeeCart')}
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
                    <Checkbox
                        checked={fiveStarsRating}
                        setChecked={() => onSelectRating('fiveStars')}
                        caption='5 stars'
                    />
                    <Checkbox
                        checked={fourStarsRating}
                        setChecked={() => onSelectRating('fourStars')}
                        caption='4 stars & up'
                    />
                    <Checkbox
                        checked={threeStarsRating}
                        setChecked={() => onSelectRating('threeStars')}
                        caption='3 stars & up'
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