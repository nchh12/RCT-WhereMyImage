const types = {
    SET_LIST_FILTERS: 'SET_LIST_FILTERS',
    SET_IMAGES_EMITTED: 'SET_IMAGES_EMITTED',
    SET_PROGRESS_EMITTED: 'SET_PROGRESS_EMITTED',
};

const actions = {
    setListFilters: ({ dispatch, payload }) => {
        dispatch({ type: types.SET_LIST_FILTERS, payload });
    },

    setImagesEmitted: ({ dispatch, payload }) => {
        dispatch({ type: types.SET_IMAGES_EMITTED, payload });
    },

    setProgressEmitted: ({ dispatch, payload }) => {
        dispatch({ type: types.SET_PROGRESS_EMITTED, payload });
    },
};

export { types, actions };
