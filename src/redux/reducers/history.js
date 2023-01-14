import update from 'immutability-helper';

const INITIAL_STATE = [];

const historyReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_HISTORY':
            return action.history;
        case 'ADD_NEW_TERM_TO_HISTORY':
            return update(state, {
                $push: [action.payload]
            });
        default:
            return state;
    }
}

export default historyReducer;