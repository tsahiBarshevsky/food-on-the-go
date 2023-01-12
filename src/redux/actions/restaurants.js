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

export { addNewRestaurant, addNewReview };