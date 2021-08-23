import React from 'react';
import { useSelector, keySelector, useDispatch, actions } from '@context';
import ImageLabeling from '@core/nativemodules/ImageLabeling';
import { EmitImagesLoading } from '@components';
import { useFilters } from '@hooks';
import { refAppOverlay } from '@navigation/AppOverlay';

const useLabelmages = () => {
    const dispatch = useDispatch();

    const setImagesEmitted = payload => {
        actions.setImagesEmitted({ dispatch, payload });
    };

    const setProgressEmitted = payload => {
        actions.setProgressEmitted({ dispatch, payload });
    };

    const getProgressEmitted = () => {
        return useSelector(keySelector.progressEmitted);
    };

    const getImagesEmitted = () => {
        return useSelector(keySelector.imagesEmitted);
    };

    const startScaning = listFilters => {
        ImageLabeling.startScaningWithFilter(listFilters || []);
        refAppOverlay.current?.show({
            component: <EmitImagesLoading />,
            cancelHandler: ImageLabeling.stopScanning,
        });
    };

    return {
        startScaning,
        setImagesEmitted,
        getImagesEmitted,
        setProgressEmitted,
        getProgressEmitted,
    };
};

export default useLabelmages;
