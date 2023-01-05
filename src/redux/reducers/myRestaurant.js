const INITIAL_STATE = {};

const myRestaurantReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_MY_RESTAURANT':
            return action.myRestaurant;
        default:
            return state;
    }
}

export default myRestaurantReducer;