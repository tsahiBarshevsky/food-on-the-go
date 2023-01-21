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
        case 'EDIT_RESTAURANT':
            const restaurant = action.payload.restaurant;
            return update(state, {
                [action.payload.index]: {
                    $merge: {
                        name: restaurant.name,
                        description: restaurant.description,
                        link: restaurant.link,
                        type: restaurant.type,
                        phone: restaurant.phone,
                        kosher: restaurant.kosher,
                        vegetarian: restaurant.vegetarian,
                        vegan: restaurant.vegan,
                        glutenFree: restaurant.glutenFree,
                        priceRange: restaurant.priceRange,
                        openingHours: restaurant.openingHours,
                        location: restaurant.location
                    }
                }
            });
        case 'REMOVE_RESTAURANT':
            return update(state, { $splice: [[action.payload, 1]] });
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
        case 'LIKE_REVIEW':
            return update(state, {
                [action.payload.restaurantIndex]: {
                    reviews: {
                        [action.payload.reviewIndex]: {
                            likes: {
                                $push: [action.payload.uid]
                            }
                        }
                    }
                }
            });
        case 'DISLIKE_REVIEW':
            return update(state, {
                [action.payload.restaurantIndex]: {
                    reviews: {
                        [action.payload.reviewIndex]: {
                            likes: {
                                $splice: [[action.payload.likeIndex, 1]]
                            }
                        }
                    }
                }
            });
        default:
            return state;
    }
}

export default restaurantsReducer;