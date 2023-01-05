const INITIAL_STATE = 0;

const dayReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_DAY':
            return action.day;
        default:
            return state;
    }
}

export default dayReducer;