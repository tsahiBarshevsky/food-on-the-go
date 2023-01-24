import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Slider } from '@miblanchard/react-native-slider';
import { AntDesign } from '@expo/vector-icons';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';
import Checkbox from '../Checkbox';
import FilterApplyButton from '../Filter Apply Button';

const STAR_SIZE = 17;

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
        distance, setDistance,
        threeStarsRating, setThreeStarsRating,
        fourStarsRating, setFourStarsRating,
        fiveStarsRating, setFiveStarsRating
    } = props;
    const { theme, onTriggerFilter } = useContext(GlobalContext);

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
        setDistance([0, 350]);
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
                modalStyle={[styles.modal, styles[`modal${theme}`]]}
                openAnimationConfig={{ timing: { duration: 200 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
                scrollViewProps={{ showsVerticalScrollIndicator: false }}
                useNativeDriver
            >
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onResetFilters}>
                            <Text>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onApplyFilters}>
                            <Text>Apply</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.title, styles[`text${theme}`]]}>Menu</Text>
                    <View style={styles.buttons}>
                        <FilterApplyButton
                            caption='Kosher'
                            value={isKosher}
                            onPress={() => setIsKosher(!isKosher)}
                        />
                        <FilterApplyButton
                            caption='Vegetarian'
                            value={isVegetarian}
                            onPress={() => setIsVegetarian(!isVegetarian)}
                        />
                        <FilterApplyButton
                            caption='Vegan'
                            value={isVegan}
                            onPress={() => setIsVegan(!isVegan)}
                        />
                        <FilterApplyButton
                            caption='Gluten Free'
                            value={isGlutenFree}
                            onPress={() => setIsGlutenFree(!isGlutenFree)}
                        />
                    </View>
                    <View style={styles.slider}>
                        <Text style={[styles.text, styles[`text${theme}`], { fontSize: 15 }]}>
                            Price
                        </Text>
                        <Text style={[styles.text, styles.caption]}>
                            {prices[0]}₪ - {prices[1]}₪
                        </Text>
                    </View>
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
                    <Text style={[styles.title, styles[`text${theme}`]]}>Accessibility</Text>
                    <View style={styles.buttons}>
                        <FilterApplyButton
                            caption='Food Truck'
                            value={foodTruck}
                            onPress={() => onSelectType('foodTruck')}
                        />
                        <FilterApplyButton
                            caption='Coffee Cart'
                            value={coffeeCart}
                            onPress={() => onSelectType('coffeeCart')}
                        />
                        <FilterApplyButton
                            caption='Open now'
                            value={isOpenNow}
                            onPress={() => setIsOpenNow(!isOpenNow)}
                        />
                        <FilterApplyButton
                            caption='Open On Saturdays'
                            value={isOpenOnSaturday}
                            onPress={() => setIsOpenOnSaturday(!isOpenOnSaturday)}
                        />
                    </View>
                    <View style={styles.slider}>
                        <Text style={[styles.text, styles[`text${theme}`], { fontSize: 15 }]}>
                            Distance
                        </Text>
                        <Text style={[styles.text, styles.caption]}>
                            {distance[0]}km - {distance[1]}km
                        </Text>
                    </View>
                    <Slider
                        value={distance}
                        onValueChange={(value) => setDistance(value)}
                        minimumValue={0}
                        maximumValue={350}
                        step={0.5}
                        // onSlidingComplete={() => onSlidingComplete('ages')}
                        thumbTintColor="#5F7ADB"
                        maximumTrackTintColor="#d3d3d3"
                        // minimumTrackTintColor={lightMode.primary}
                        trackClickable
                        animateTransitions
                    />
                    <Text style={[styles.title, styles[`text${theme}`]]}>Rating</Text>
                    <View style={styles.review}>
                        <View style={styles.wrapper}>
                            <View style={styles.stars}>
                                {[...Array(5).keys()].map((item) => {
                                    if (item < 4)
                                        return (<AntDesign key={item} name="star" size={STAR_SIZE} color="#f9bb04" />);
                                    else
                                        return (<AntDesign key={item} name="staro" size={STAR_SIZE} color="#f9bb04" />);
                                })}
                            </View>
                            <Text style={[styles.text, styles[`text${theme}`]]}> & up</Text>
                        </View>
                        <Checkbox
                            checked={fiveStarsRating}
                            setChecked={() => onSelectRating('fiveStars')}
                            withCaption={false}
                        />
                    </View>
                    <View style={styles.review}>
                        <View style={styles.wrapper}>
                            <View style={styles.stars}>
                                {[...Array(5).keys()].map((item) => {
                                    if (item < 3)
                                        return (<AntDesign key={item} name="star" size={STAR_SIZE} color="#f9bb04" />);
                                    else
                                        return (<AntDesign key={item} name="staro" size={STAR_SIZE} color="#f9bb04" />);
                                })}
                            </View>
                            <Text style={[styles.text, styles[`text${theme}`]]}> & up</Text>
                        </View>
                        <Checkbox
                            checked={fourStarsRating}
                            setChecked={() => onSelectRating('fourStars')}
                            withCaption={false}
                        />
                    </View>
                    <View style={styles.review}>
                        <View style={styles.wrapper}>
                            <View style={styles.stars}>
                                {[...Array(5).keys()].map((item) => {
                                    if (item < 2)
                                        return (<AntDesign key={item} name="star" size={STAR_SIZE} color="#f9bb04" />);
                                    else
                                        return (<AntDesign key={item} name="staro" size={STAR_SIZE} color="#f9bb04" />);
                                })}
                            </View>
                            <Text style={[styles.text, styles[`text${theme}`]]}> & up</Text>
                        </View>
                        <Checkbox
                            checked={threeStarsRating}
                            setChecked={() => onSelectRating('threeStars')}
                            withCaption={false}
                        />
                    </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    review: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    stars: {
        flexDirection: 'row',
        marginRight: 5
    },
    title: {
        fontSize: 18,
        fontFamily: 'QuicksandBold',
        transform: [{ translateY: -1.5 }],
        marginBottom: 5
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
    slider: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    caption: {
        color: 'grey',
        fontSize: 13
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        marginBottom: 5
    }
});