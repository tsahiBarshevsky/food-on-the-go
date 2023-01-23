import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const AVATAR_SIZE = 90;

const Header = (props) => {
    const { navigation, currentUser, onUploadNewImage, userReviews, ownedRestaurant, onRemoveRestaurant } = props;
    const user = useSelector(state => state.user);

    return (
        <View>
            <View style={styles.header}>
                <View style={styles.avatarWrapper}>
                    <TouchableOpacity
                        onPress={onUploadNewImage}
                        style={styles.camera}
                    >
                        <FontAwesome name="camera" size={13} color="white" />
                    </TouchableOpacity>
                    <View style={styles.avatar}>
                        {currentUser.photoURL ?
                            <Image
                                source={{ uri: currentUser.photoURL }}
                                style={styles.image}
                            />
                            :
                            <Text style={styles.letter}>
                                {currentUser.displayName.charAt(0)}
                            </Text>
                        }
                    </View>
                </View>
                <Text>{currentUser.displayName}</Text>
                <Text>{currentUser.email}</Text>
            </View>
            {user.type === 'owner' && Object.keys(ownedRestaurant).length === 0 ?
                <View>
                    <Text style={styles.title}>Owned restaurant</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Insertion')}>
                        <Text>Add new restaurant</Text>
                    </TouchableOpacity>
                </View>
                :
                <View>
                    <Text>My restaurant: {ownedRestaurant.name}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Editing', { restaurant: ownedRestaurant })}>
                        <Text>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onRemoveRestaurant}>
                        <Text>Delete</Text>
                    </TouchableOpacity>
                </View>
            }
            <Text style={styles.title}>Restaurants I've been reviewd ({userReviews.length})</Text>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 1.5,
        borderColor: 'black',
        marginBottom: 10
    },
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: AVATAR_SIZE - 8,
        height: AVATAR_SIZE - 8,
        borderRadius: (AVATAR_SIZE - 8) / 2,
        backgroundColor: 'royalblue',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: (AVATAR_SIZE - 8) / 2
    },
    letter: {
        fontSize: 55,
        fontWeight: 'bold',
        // color: background,
        textTransform: 'uppercase',
        transform: [{ translateY: -1 }]
    },
    camera: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 14,
        bottom: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'black'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});