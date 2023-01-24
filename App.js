import 'react-native-gesture-handler';
import React from 'react';
import { I18nManager } from "react-native";
import { useFonts } from 'expo-font';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { GlobalProvider } from './src/utils/context';
import RootNavigator from './src/navigators/rootNavigator';
import rootReducer from './src/redux/reducers';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
const store = createStore(rootReducer);

export default function App() {
    const [loaded] = useFonts({
        Quicksand: require('./assets/fonts/Quicksand-Regular.ttf'),
        QuicksandBold: require('./assets/fonts/Quicksand-Bold.ttf'),
        BebasNeue: require('./assets/fonts/BebasNeue-Regular.ttf')
    });

    if (!loaded)
        return null;

    return (
        <Provider store={store}>
            <GlobalProvider>
                <RootNavigator />
            </GlobalProvider>
        </Provider>
    );
}
