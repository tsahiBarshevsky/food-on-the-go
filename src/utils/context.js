import React, { useState } from 'react';

export const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [triggerFilter, setTriggerFilter] = useState(false)

    const onTriggerFilter = (value) => {
        setTriggerFilter(value);
    }

    return (
        <GlobalContext.Provider value={{ triggerFilter, onTriggerFilter }}>
            {children}
        </GlobalContext.Provider>
    )
}