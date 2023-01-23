const addNewTermToHistory = (term) => {
    return {
        type: 'ADD_NEW_TERM_TO_HISTORY',
        payload: term
    }
};

const clearHistory = () => {
    return {
        type: 'CLEAR_HISTORY'
    }
}

export { addNewTermToHistory, clearHistory };