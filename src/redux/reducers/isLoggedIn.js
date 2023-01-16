const INITIAL_STATE = false;

const isLoggedInReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_IS_LOGGED_IN':
            return action.isLoggedIn;
        default:
            return state;
    }
}

export default isLoggedInReducer;