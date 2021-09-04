import React, { useEffect } from 'react';
import { getRoute } from '@navigation/AppNavigation';
import { Splash } from '@core/nativemodules';

const RootApp = ({ navigation, screen }) => {
    useEffect(() => {
        let timemout = setTimeout(() => {
            Splash?.hide?.();
        }, 1000);

        return () => {
            clearTimeout(timemout);
        };
    }, []);

    const Component = getRoute(screen || 'InputScreen');

    return <Component navigation={navigation} />;
};

export default RootApp;
