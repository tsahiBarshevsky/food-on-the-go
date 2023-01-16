import 'react-native-gesture-handler';
import React from 'react';
import { I18nManager } from "react-native";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import RootNavigator from './src/navigators/rootNavigator';
import rootReducer from './src/redux/reducers';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
const store = createStore(rootReducer);

export default function App() {
    return (
        <Provider store={store}>
            <RootNavigator />
        </Provider>
    );
}
