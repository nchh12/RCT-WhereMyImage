const types = {
    SET_LIST_FILTERS: 'SET_LIST_FILTERS',
};

const actions = {
    setListFilters: ({ dispatch, payload }) => {
        dispatch({ type: types.SET_LIST_FILTERS, payload });
    },
};

export { types, actions };
