import update from 'immutability-helper';

const INITIAL_STATE = {};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.user;
        case 'UPDATE_IMAGE':
            return update(state, {
                $merge: {
                    image: action.payload
                }
            });
        case 'ADD_RESTAURANT_TO_SAVED':
            return update(state, {
                saved: {
                    [action.payload.list]: {
                        list: {
                            $push: [action.payload.id]
                        }
                    }
                }
            });
        case 'REMOVE_RESTAURANT_FROM_SAVED':
            return update(state, {
                saved: {
                    [action.payload.list]: {
                        list: {
                            $splice: [[action.payload.index, 1]]
                        }
                    }
                }
            });
        case 'ADD_CUSTOM_LIST':
            return update(state, {
                saved: {
                    [action.payload.listName]: { $set: action.payload.customList }
                }
            });
        case 'UPDATE_CUSTOM_LIST':
            return update(state, {
                saved: {
                    [action.payload.listName]: {
                        $set: action.payload.customList
                    }
                }
            });
        case 'REMOVE_CUSTOM_LIST':
            return update(state, {
                saved: {
                    $unset: [action.payload.listName]
                }
            });
        default:
            return state;
    }
}

export default userReducer;