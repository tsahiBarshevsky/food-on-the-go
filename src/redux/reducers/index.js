import { combineReducers } from "redux";
import myRestaurantReducer from "./myRestaurant";
import restaurantsReducer from "./restaurants";

const rootReducer = combineReducers({
    myRestaurant: myRestaurantReducer,
    restaurants: restaurantsReducer
});

export default rootReducer;