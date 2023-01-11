import update from 'immutability-helper';

const INITIAL_STATE = {};

const reviewReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_REVIEW':
            return action.review;
        default:
            return state;
    }
}

export default reviewReducer;