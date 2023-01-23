import React, { useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { getIsUsingSystemScheme, getTheme, updateTheme } from './AsyncStorageManagement';

export const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [triggerFilter, setTriggerFilter] = useState(false)
    const [theme, setTheme] = useState('');
    const [isUsinSystemScheme, setIsUsinSystemScheme] = useState('false');

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

    const toggleIsUsinSystemScheme = (newStatus) => {
        setIsUsinSystemScheme(newStatus);
    }

    useEffect(() => {
        getTheme().then((theme) => setTheme(theme));
        getIsUsingSystemScheme().then((isUsinSystemScheme) => setIsUsinSystemScheme(isUsinSystemScheme))
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                theme, toggleTheme,
                isUsinSystemScheme, toggleIsUsinSystemScheme,
                triggerFilter, onTriggerFilter
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}