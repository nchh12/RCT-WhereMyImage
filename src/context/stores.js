const state = {
    //
    textDesc: '',
    listFilters: [],

    //emit result
    imagesEmitted: [],
    progressEmitted: {},
};

const keySelector = {
    textDesc: 'textDesc',
    listFilters: 'listFilters',
    imagesEmitted: 'imagesEmitted',
    progressEmitted: 'progressEmitted',
};

export { state, keySelector };
