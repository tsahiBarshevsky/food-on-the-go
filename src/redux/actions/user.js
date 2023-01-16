const updateImage = (url) => {
    return {
        type: 'UPDATE_IMAGE',
        payload: url
    }
};

const addRestaurantToSaved = (list, id) => {
    return {
        type: 'ADD_RESTAURANT_TO_SAVED',
        payload: {
            list: list,
            id: id
        }
    }
};

const removeRestaurantFromSaved = (list, index) => {
    return {
        type: 'REMOVE_RESTAURANT_FROM_SAVED',
        payload: {
            list: list,
            index: index
        }
    }
};

export {
    updateImage,
    addRestaurantToSaved,
    removeRestaurantFromSaved
};