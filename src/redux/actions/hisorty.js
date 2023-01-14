const addNewTermToHistory = (term) => {
    return {
        type: 'ADD_NEW_TERM_TO_HISTORY',
        payload: term
    }
};

export { addNewTermToHistory };