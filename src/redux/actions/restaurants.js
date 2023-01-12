const addNewRestaurant = (restaurant) => {
    return {
        type: 'ADD_NEW_RESTAURANT',
        payload: restaurant
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

export { addNewRestaurant, addNewReview, editReview };