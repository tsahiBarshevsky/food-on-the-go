import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { StatBox, MinimalReviewCard } from '../../components';
import globalStyles from '../../utils/globalStyles';

const AVATAR_SIZE = 60;

const UserScreen = ({ route }) => {
    const { user, name } = route.params;
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
        <View style={globalStyles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Entypo name="chevron-left" size={25} color="black" />
            </TouchableOpacity>
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
                <Text>{name}</Text>
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
                    caption='Likes'
                    value={likes}
                />
            </View>
            <Text style={styles.title}>Reviews</Text>
            <FlatList
                data={contributions}
                keyExtractor={(item) => item.id}
                style={{ flexGrow: 0 }}
                renderItem={({ item }) => {
                    return (
                        <MinimalReviewCard
                            restaurant={item}
                            review={item.review}
                        />
                    )
                }}
            />
            <Text style={styles.title}>Lists</Text>
            <FlatList
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
            />
        </View>
    )
}

export default UserScreen;

const styles = StyleSheet.create({
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
        backgroundColor: 'black',
        marginRight: 10
    },
    letter: {
        color: 'white',
        fontSize: 25,
        textTransform: 'capitalize',
        transform: [{ translateY: -1 }]
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 15
    },
    title: {
        fontSize: 20
    }
});