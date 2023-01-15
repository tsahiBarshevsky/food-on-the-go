const INITIAL_STATE = {};

const ownedRestaurantReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_OWNED_RESTAURANT':
            return action.ownedRestaurant;
        default:
            return state;
    }
}

export default ownedRestaurantReducer;