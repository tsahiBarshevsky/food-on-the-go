import update from 'immutability-helper';

const INITIAL_STATE = [];

const restaurantsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_RESTAURANTS':
            return action.restaurants;
        case 'ADD_NEW_RESTAURANT':
            return update(state, {
                $push: [action.payload]
            });
        default:
            return state;
    }
}

export default restaurantsReducer;