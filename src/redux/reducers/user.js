import update from 'immutability-helper';

const INITIAL_STATE = {};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.user;
        case 'ADD_RESTAURANT_TO_SAVED':
            return update(state, {
                saved: {
                    [action.payload.list]: {
                        $push: [action.payload.id]
                    }
                }
            });
        case 'REMOVE_RESTAURANT_FROM_SAVED':
            return update(state, {
                saved: {
                    [action.payload.list]: {
                        $splice: [[action.payload.index, 1]]
                    }
                }
            });
        default:
            return state;
    }
}

export default userReducer;