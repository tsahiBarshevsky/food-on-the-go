const updateRating = (key) => {
    return {
        type: 'UPDATE_RATING',
        payload: key
    }
};

const resetReview = () => {
    return {
        type: 'RESET_REVIEW'
    }
};

export { updateRating, resetReview };