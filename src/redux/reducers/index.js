import { combineReducers } from "redux";
import dayReducer from './day';

const rootReducer = combineReducers({
    day: dayReducer
});

export default rootReducer;