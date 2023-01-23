import React, { useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { getTheme, updateTheme } from './AsyncStorageManagement';

export const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [triggerFilter, setTriggerFilter] = useState(false)
    const [theme, setTheme] = useState('');

    const onTriggerFilter = (value) => {
        setTriggerFilter(value);
    }

    const toggleTheme = async (newTheme) => {
        switch (newTheme) {
            case 'Light':
                setTheme('Light');
                updateTheme('Light'); // Update AsyncStorage
                break;
            case 'Dark':
                setTheme('Dark');
                updateTheme('Dark'); // Update AsyncStorage
                break;
            default:
                const colorScheme = Appearance.getColorScheme();
                setTheme(colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1));
                updateTheme(colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1));
                break;
        }
    }

    useEffect(() => {
        getTheme().then((theme) => setTheme(theme));
    }, []);

    return (
        <GlobalContext.Provider value={{ theme, toggleTheme, triggerFilter, onTriggerFilter }}>
            {children}
        </GlobalContext.Provider>
    )
}