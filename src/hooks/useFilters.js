import { useLayoutEffect } from 'react';
import { useSelector, keySelector, useDispatch, actions } from '@context';
import assets from '@assets';

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
        const RECOMMENDED_LABELS = [0, 1, 2];
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

    return {
        getListFilters,
        enableFilter,
        removeFilter,
        addFilter,
    };
};

export default useFilters;
