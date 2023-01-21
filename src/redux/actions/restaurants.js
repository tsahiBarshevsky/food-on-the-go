const addNewRestaurant = (restaurant) => {
    return {
        type: 'ADD_NEW_RESTAURANT',
        payload: restaurant
    }
};

const editRestaurant = (index, restaurant) => {
    return {
        type: 'EDIT_RESTAURANT',
        payload: {
            index: index,
            restaurant: restaurant
        }
    }
};

const removeRestaurant = (index) => {
    return {
        type: 'REMOVE_RESTAURANT',
        payload: index
    }
};

const addNewReview = (index, newReview) => {
    return {
        type: 'ADD_NEW_REVIEW',
        payload: {
            newReview: newReview,
            index: index
        }
    }
};

const editReview = (restaurantIndex, reviewIndex, editedReview) => {
    return {
        type: 'EDIT_REVIEW',
        payload: {
            restaurantIndex: restaurantIndex,
            reviewIndex: reviewIndex,
            editedReview: editedReview
        }
    }
};

const deleteReview = (restaurantIndex, reviewIndex) => {
    return {
        type: 'DELETE_REVIEW',
        payload: {
            restaurantIndex: restaurantIndex,
            reviewIndex: reviewIndex
        }
    }
};

const likeReview = (restaurantIndex, reviewIndex, uid) => {
    return {
        type: 'LIKE_REVIEW',
        payload: {
            restaurantIndex: restaurantIndex,
            reviewIndex: reviewIndex,
            uid: uid
        }
    }
};

const dislikeReview = (restaurantIndex, reviewIndex, likeIndex) => {
    return {
        type: 'DISLIKE_REVIEW',
        payload: {
            restaurantIndex: restaurantIndex,
            reviewIndex: reviewIndex,
            likeIndex: likeIndex
        }
    }
};

export {
    addNewRestaurant,
    editRestaurant,
    removeRestaurant,
    addNewReview,
    editReview,
    deleteReview,
    likeReview,
    dislikeReview
};