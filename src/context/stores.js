const state = {
    listFilters: [],

    //emit result
    imagesEmitted: [],
    progressEmitted: {},
};

const keySelector = {
    listFilters: 'listFilters',
    imagesEmitted: 'imagesEmitted',
    progressEmitted: 'progressEmitted',
};

export { state, keySelector };
