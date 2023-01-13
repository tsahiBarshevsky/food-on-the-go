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
        case 'ADD_NEW_REVIEW':
            return update(state, {
                [action.payload.index]: {
                    reviews: {
                        $push: [action.payload.newReview]
                    }
                }
            });
        case 'EDIT_REVIEW':
            return update(state, {
                [action.payload.restaurantIndex]: {
                    reviews: {
                        [action.payload.reviewIndex]: {
                            $set: action.payload.editedReview
                        }
                    }
                }
            });
        case 'DELETE_REVIEW':
            return update(state, {
                [action.payload.restaurantIndex]: {
                    reviews: {
                        $splice: [[action.payload.reviewIndex, 1]]
                    }
                }
            });
        default:
            return state;
    }
}

export default restaurantsReducer;