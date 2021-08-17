import { types } from './actions';

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case types.SET_LIST_FILTERS:
            return { ...state, listFilters: payload };
        default:
            return state;
    }
};

export default reducer;
