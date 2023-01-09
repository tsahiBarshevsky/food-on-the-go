const INITIAL_STATE = {};

const ownedRestaurantsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_OWNED_RESTAURANTS':
            return action.ownedRestaurants;
        default:
            return state;
    }
}

export default ownedRestaurantsReducer;