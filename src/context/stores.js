const state = {
    //
    textDesc: '',
    listFilters: [],
    parseLabels: [],

    //emit result
    imagesEmitted: [],
    progressEmitted: {},
};

const keySelector = {
    textDesc: 'textDesc',
    parseLabels: 'parseLabels',
    listFilters: 'listFilters',
    imagesEmitted: 'imagesEmitted',
    progressEmitted: 'progressEmitted',
};

export { state, keySelector };
