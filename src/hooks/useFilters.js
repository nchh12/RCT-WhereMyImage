import { useLayoutEffect } from 'react';
import { useSelector, keySelector, useDispatch, actions } from '@context';
import assets from '@assets';
const keyword_extractor = require('keyword-extractor');
const synonyms = require('synonyms');
const pluralize = require('pluralize');

const useFilters = () => {
    const listFilters = useSelector(keySelector.listFilters);
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (!listFilters?.length) {
            const listTemp = _generateListTmp();
            _setListFilters(listTemp);
        }
    }, [listFilters]);

    const _setListFilters = list => {
        actions.setListFilters({ dispatch, payload: list });
    };

    const _generateListTmp = () => {
        const baseLabels = assets?.recommended_labels?.list || [];
        const RECOMMENDED_LABELS = [0, 1, 2, 3];
        const tmpList = [];
        RECOMMENDED_LABELS.forEach(_ => {
            const label = baseLabels?.[parseInt(Math.random() * baseLabels.length)];
            tmpList.push({
                label,
                disable: true,
            });
        });
        return tmpList;
    };

    const getListFilters = () => {
        return listFilters;
    };

    const removeFilter = _index => {
        _setListFilters(listFilters.filter((_, index) => index !== _index));
    };

    const addFilter = label => {
        const list = [{ label, disable: false }, ...listFilters];
        _setListFilters(list);
    };

    const enableFilter = _index => {
        const list = listFilters.map((item, index) =>
            index !== _index ? item : { ...item, disable: false }
        );
        _setListFilters(list);
    };

    const extractKeywords = sentence => {
        return keyword_extractor.extract(sentence, {
            language: 'english',
            remove_digits: true,
            return_changed_case: true,
            remove_duplicates: true,
        });
    };

    const getListLabels = () => {
        const listString = listFilters
            .filter(item => !item?.disable) //remove list suggested
            .map(item => item?.label.toLowerCase()) // to lowercase
            .map(word => pluralize.singular(word)); // singularize

        const res = [];
        listString.forEach(word => {
            const synonymsObj = synonyms(word) || {};
            const synonymsList = Object.values(synonymsObj).reduce(
                (accumulator = [], value = []) => [...accumulator, ...value],
                []
            );
            res.push(...synonymsList);
        });
        return res;
    };

    const isInEnableLabels = label => {
        const list = getListLabels();
        return list.includes(label);
    };

    return {
        isInEnableLabels,
        getListFilters,
        getListLabels,
        enableFilter,
        removeFilter,
        addFilter,
    };
};

export default useFilters;
