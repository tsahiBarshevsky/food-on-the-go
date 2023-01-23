import AsyncStorage from '@react-native-async-storage/async-storage';

/* === Search history === */

const getHistoryFromStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('history');
        return jsonValue !== null ? JSON.parse(jsonValue) : [];
    }
    catch (e) {
        alert("An unknown error occurred.");
        console.log(e.message);
    }
}

const updateHistoryInStorage = async (newArray) => {
    try {
        await AsyncStorage.setItem('history', newArray);
    }
    catch (e) {
        alert("An unknown error occurred.");
        console.log(e.message);
    }
}

const clearHistoryInStorage = async () => {
    try {
        await AsyncStorage.multiRemove(['history']);
    } catch (e) {
        alert("An unknown error occurred.");
        console.log(e.message);
    }
}

/* === Theme === */

const getTheme = async () => {
    try {
        const theme = await AsyncStorage.getItem('theme');
        return theme != null ? theme : 'Light';
    }
    catch (e) {
        alert("An unknown error occurred.");
    }
}

const updateTheme = async (theme) => {
    try {
        await AsyncStorage.setItem('theme', theme);
    }
    catch (e) {
        alert("An unknown error occurred.");
    }
}

const getIsUsingSystemScheme = async () => {
    try {
        const systemScheme = await AsyncStorage.getItem('systemScheme');
        return systemScheme !== null ? systemScheme : 'false';
    }
    catch (e) {
        alert("An unknown error occurred.");
    }
}

const updateIsUsingSystemScheme = async (value) => {
    try {
        await AsyncStorage.setItem('systemScheme', value);
    }
    catch (e) {
        alert("An unknown error occurred.");
    }
}

export {
    getHistoryFromStorage,
    updateHistoryInStorage,
    clearHistoryInStorage,
    getTheme,
    updateTheme,
    getIsUsingSystemScheme,
    updateIsUsingSystemScheme
};