import { combineReducers } from "redux";
import ownedRestaurantsReducer from "./ownedRestaurants";
import restaurantsReducer from "./restaurants";
import userReducer from './user';
import locationReducer from './location';

const rootReducer = combineReducers({
    restaurants: restaurantsReducer,
    ownedRestaurants: ownedRestaurantsReducer,
    user: userReducer,
    location: locationReducer
});

export default rootReducer;