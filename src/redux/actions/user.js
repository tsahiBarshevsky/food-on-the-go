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

const addCustomList = (listName, customList) => {
    return {
        type: 'ADD_CUSTOM_LIST',
        payload: {
            listName: listName,
            customList: customList
        }
    }
};

const updateCustomListName = (listName, list) => {
    return {
        type: 'UPDATE_CUSTOM_LIST_NAME',
        payload: {
            listName: listName,
            list: list
        }
    }
};

const removeCustomList = (listName) => {
    return {
        type: 'REMOVE_CUSTOM_LIST',
        payload: {
            listName: listName
        }
    }
};

export {
    updateImage,
    addRestaurantToSaved,
    removeRestaurantFromSaved,
    addCustomList,
    updateCustomListName,
    removeCustomList
};