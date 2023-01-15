import { combineReducers } from "redux";
import ownedRestaurantReducer from "./ownedRestaurants";
import restaurantsReducer from "./restaurants";
import userReducer from './user';
import locationReducer from './location';
import reviewReducer from "./review";
import historyReducer from './history';

const rootReducer = combineReducers({
    restaurants: restaurantsReducer,
    ownedRestaurant: ownedRestaurantReducer,
    user: userReducer,
    location: locationReducer,
    review: reviewReducer,
    history: historyReducer
});

export default rootReducer;