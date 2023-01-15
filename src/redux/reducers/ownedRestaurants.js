const INITIAL_STATE = {};

const ownedRestaurantReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_OWNED_RESTAURANT':
            return action.ownedRestaurant;
        case 'RESET_OWNED_RESTAURANT':
            return INITIAL_STATE;
        default:
            return state;
    }
}

export default ownedRestaurantReducer;