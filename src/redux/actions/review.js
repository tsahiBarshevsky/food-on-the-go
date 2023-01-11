const updateRating = (key) => {
    return {
        type: 'UPDATE_RATING',
        payload: key
    }
};

export { updateRating };