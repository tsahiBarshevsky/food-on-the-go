import React, { useState, useCallback } from 'react';
import { Entypo } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateRating } from '../../redux/actions/review';
import globalStyles from '../../utils/globalStyles';
import { RatingBar } from '../../components';
import { authentication } from '../../utils/firebase';

// React Native components
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    BackHandler
} from 'react-native';

const AVATAR_SIZE = 45;

const ReviewScreen = ({ route }) => {
    const { currentRating } = route.params;
    const [comment, setComment] = useState('');
    const review = useSelector(state => state.review);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const resetReview = () => {
        dispatch(updateRating(currentRating));
    }

    const onCancelReview = () => {
        dispatch(updateRating(currentRating));
        navigation.goBack();
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                resetReview();
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <View style={globalStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => onCancelReview()}
                    style={styles.backButton}
                >
                    <Entypo name="chevron-left" size={22} color="black" />
                </TouchableOpacity>
                <Text>TBA: Restaurant</Text>
                <TouchableOpacity>
                    <Text>Post</Text>
                </TouchableOpacity>
            </View>
            {/* <Text>Old: {currentRating}</Text>
            <Text>New: {review.rating}</Text> */}
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <View style={styles.user}>
                        <View style={styles.avatar}>
                            <Text style={styles.letter}>
                                {authentication.currentUser.email.charAt(0)}
                            </Text>
                        </View>
                        <View>
                            <Text>{authentication.currentUser.displayName}</Text>
                            <Text>{authentication.currentUser.email}</Text>
                        </View>
                    </View>
                    <View style={styles.ratingBar}>
                        <RatingBar currentRating={currentRating} />
                    </View>
                    <Text>Share some thoughts about...</Text>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            placeholder="It's optional, you don't have to"
                            value={comment}
                            onChangeText={(text) => setComment(text)}
                            underlineColorAndroid="transparent"
                            // placeholderTextColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                            // selectionColor={theme === 'Light' ? lightMode.placeholder : darkMode.placeholder}
                            multiline
                            blurOnSubmit={false}
                            style={styles.textInput}
                        />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

export default ReviewScreen;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingHorizontal: 15,
        paddingBottom: 20
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: 'black',
        marginRight: 10
    },
    letter: {
        color: 'white',
        fontSize: 25,
        textTransform: 'capitalize',
        transform: [{ translateY: -1 }]
    },
    ratingBar: {
        paddingVertical: 10
    },
    scrollView: {
        paddingHorizontal: 15,
        paddingBottom: 15
    }
});