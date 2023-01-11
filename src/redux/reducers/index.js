import { combineReducers } from "redux";
import ownedRestaurantsReducer from "./ownedRestaurants";
import restaurantsReducer from "./restaurants";
import userReducer from './user';
import locationReducer from './location';
import reviewReducer from "./review";

const rootReducer = combineReducers({
    restaurants: restaurantsReducer,
    ownedRestaurants: ownedRestaurantsReducer,
    user: userReducer,
    location: locationReducer,
    review: reviewReducer
});

export default rootReducer;