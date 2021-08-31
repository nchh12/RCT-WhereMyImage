const types = {
    SET_LIST_FILTERS: 'SET_LIST_FILTERS',
    SET_TEXT_DESC: 'SET_TEXT_DESC',
    SET_IMAGES_EMITTED: 'SET_IMAGES_EMITTED',
    ADD_IMAGES_EMITTED: 'ADD_IMAGES_EMITTED',
    SET_PROGRESS_EMITTED: 'SET_PROGRESS_EMITTED',
};

const actions = {
    setListFilters: ({ dispatch, payload }) => {
        dispatch({ type: types.SET_LIST_FILTERS, payload });
    },

    setTextDesc: ({ dispatch, payload }) => {
        dispatch({ type: types.SET_TEXT_DESC, payload });
    },

    setImagesEmitted: ({ dispatch, payload }) => {
        dispatch({ type: types.SET_IMAGES_EMITTED, payload });
    },

    addImagesEmitted: ({ dispatch, payload }) => {
        dispatch({ type: types.ADD_IMAGES_EMITTED, payload });
    },

    setProgressEmitted: ({ dispatch, payload }) => {
        dispatch({ type: types.SET_PROGRESS_EMITTED, payload });
    },
};

export { types, actions };
