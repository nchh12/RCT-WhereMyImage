import React, { useRef } from 'react';
import { useSelector, keySelector, useDispatch, actions } from '@context';
import ImageLabeling from '@core/nativemodules/ImageLabeling';
import { EmitImagesLoading } from '@components';
import { refAppOverlay } from '@navigation/AppOverlay';

const useLabelmages = () => {
    const dispatch = useDispatch();
    const listener = useRef(null);

    const _setImagesEmitted = list => {
        actions.setImagesEmitted({ dispatch, payload: list });
    };

    const _addImagesEmitted = item => {
        actions.addImagesEmitted({ dispatch, payload: item });
    };

    const _setProgressEmitted = payload => {
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

    const addListenerEmitting = () => {
        listener.current = ImageLabeling.listen(res => {
            console.log(JSON.stringify(res, null, 2));
            switch (res?.status) {
                case 'onResponse':
                    _addImagesEmitted(res);
                    break;
                case 'onFinish':
                    refAppOverlay?.current?.hide();
                    break;
                case 'onProgress':
                    _setProgressEmitted(res);
                    break;
            }
        });
    };

    const removeListenerEmitting = () => {
        ImageLabeling.stopScanning();
        listener.current?.remove();
    };

    const clearResults = () => {
        _setImagesEmitted([]);
        _setProgressEmitted({});
    };

    return {
        clearResults,
        startScaning,
        getImagesEmitted,
        getProgressEmitted,
        addListenerEmitting,
        removeListenerEmitting,
    };
};

export default useLabelmages;
