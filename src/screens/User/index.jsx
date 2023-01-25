import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ScrollView, Image, FlatList, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { StatBox, MinimalReviewCard } from '../../components';
import { GlobalContext } from '../../utils/context';
import { lightTheme, darkTheme } from '../../utils/themes';
import globalStyles from '../../utils/globalStyles';

const AVATAR_SIZE = 60;

const UserScreen = ({ route }) => {
    const { user, name } = route.params;
    const { theme } = useContext(GlobalContext);
    const [contributions, setContributions] = useState([]);
    const [lists, setLists] = useState([]);
    const [likes, setLikes] = useState(0);
    const restaurants = useSelector(state => state.restaurants);
    const navigation = useNavigation();

    const createPublicListsArray = () => {
        const arr = [];
        Object.keys(user.saved).forEach((key) => {
            if (user.saved[key].privacy === 'public')
                arr.push(user.saved[key]);
        });
        setLists(arr);
    }

    const createContributionsArray = () => {
        const userReviews = [...restaurants].filter((item) => item.reviews.some((review) => review.user.uid === user.uid));
        const arr = [];
        let counter = 0;
        userReviews.forEach((item) => {
            const review = item.reviews.find((review) => review.user.uid === user.uid);
            arr.push({ id: item.id, name: item.name, type: item.type, city: item.location.city, review: review });
            counter += review.likes.length;
        });
        setContributions(arr);
        setLikes(counter);
    }

    useEffect(() => {
        createPublicListsArray();
        createContributionsArray();
    }, []);

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Entypo name="chevron-left" size={22} color={theme === 'Light' ? "black" : "white"} />
                </TouchableOpacity>
            </View>
            <View style={styles.user}>
                {user.image ?
                    <Image
                        source={{ uri: user.image }}
                        style={styles.image}
                    />
                    :
                    <View style={styles.avatar}>
                        <Text style={styles.letter}>
                            {name.charAt(0)}
                        </Text>
                    </View>
                }
                <Text style={[styles.text, styles.name, styles[`text${theme}`]]}>{name}</Text>
            </View>
            <View style={styles.stats}>
                <StatBox
                    caption='Contributions'
                    value={contributions.length}
                />
                <StatBox
                    caption='Public Lists'
                    value={lists.length}
                />
                <StatBox
                    caption='Reviews Likes'
                    value={likes}
                />
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={[styles.title, styles.text, styles[`text${theme}`]]}>Reviews</Text>
                {contributions.slice(0, 2).map((restaurant, index) => {
                    return (
                        <View key={restaurant.id}>
                            <MinimalReviewCard
                                restaurant={restaurant}
                                review={restaurant.review}
                            />
                            {index !== contributions.slice(0, 2).length - 1 &&
                                <View style={[styles.separator, styles[`separator${theme}`]]} />
                            }
                        </View>
                    )
                })}
                {contributions.length >= 2 &&
                    <TouchableOpacity
                        onPress={() => navigation.navigate('UserReviews', { reviews: contributions })}
                        style={styles.button}
                    >
                        <Text style={[styles.text, styles.caption, styles[`caption${theme}`]]}>
                            View all reviews
                        </Text>
                    </TouchableOpacity>
                }
                <Text
                    style={[
                        styles.title,
                        styles.text,
                        styles[`text${theme}`],
                        { marginTop: 10 }
                    ]}
                >
                    Lists
                </Text>
                {/* <FlatList
                    data={lists}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ flexGrow: 0 }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SavedMap', { list: item.name, user: user })}
                            >
                                <Text>{item.name} - {item.list.length} places</Text>
                            </TouchableOpacity>
                        )
                    }}
                /> */}
            </ScrollView>
        </SafeAreaView>
    )
}

export default UserScreen;

const styles = StyleSheet.create({
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
    name: {
        fontSize: 20,
        marginTop: 5
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 10,
        paddingHorizontal: 15,
        paddingBottom: 10
    },
    user: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        marginBottom: 5
    },
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: lightTheme.icon
    },
    letter: {
        fontSize: 45,
        fontFamily: 'BebasNeue',
        color: 'white',
        textTransform: 'capitalize',
        transform: [{ translateY: -1 }]
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 15,
        marginBottom: 15
    },
    title: {
        fontSize: 20,
        marginBottom: 5
    },
    scrollView: {
        paddingHorizontal: 15
    },
    separator: {
        width: '100%',
        height: 1,
        marginVertical: 15
    },
    separatorLight: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    separatorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    button: {
        alignSelf: 'center',
        marginTop: 5
    },
    caption: {
        fontSize: 16
    },
    captionLight: {
        color: '#1a73e8'
    },
    captionDark: {
        color: '#8cb4f1'
    }
});