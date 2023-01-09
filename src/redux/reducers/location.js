const INITIAL_STATE = {};

const locationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_LOCATION':
            return action.location;
        default:
            return state;
    }
}

export default locationReducer;