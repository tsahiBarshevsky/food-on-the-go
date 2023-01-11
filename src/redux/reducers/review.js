import update from 'immutability-helper';

const INITIAL_STATE = {};

const reviewReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_REVIEW':
            return action.review;
        case 'UPDATE_RATING':
            return update(state, {
                rating: { $set: action.payload }
            })
        default:
            return state;
    }
}

export default reviewReducer;