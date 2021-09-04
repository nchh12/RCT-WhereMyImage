import { types } from './actions';

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case types.SET_LIST_FILTERS:
            return { ...state, listFilters: payload };
        case types.SET_TEXT_DESC:
            return { ...state, textDesc: payload };
        case types.SET_PARSE_LABELS:
            return { ...state, parseLabels: payload };
        case types.SET_IMAGES_EMITTED:
            return { ...state, imagesEmitted: payload };
        case types.ADD_IMAGES_EMITTED:
            return { ...state, imagesEmitted: [...[payload], ...state.imagesEmitted] };
        case types.SET_PROGRESS_EMITTED:
            return { ...state, progressEmitted: payload };
        default:
            return state;
    }
};

export default reducer;
