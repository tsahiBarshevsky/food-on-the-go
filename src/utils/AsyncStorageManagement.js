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

export { getHistoryFromStorage, updateHistoryInStorage };