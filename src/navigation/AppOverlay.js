import React, {
    useLayoutEffect,
    forwardRef,
    useImperativeHandle,
    useState,
    useRef,
    useCallback,
} from 'react';
import { StyleSheet, Animated, BackHandler, TouchableOpacity } from 'react-native';
import Colors from '@utils/Colors';
import { deepMemo } from 'use-hook-kits';

export const refAppOverlay = React.createRef(null);

const DURATION = 500;

const AppOverlay = forwardRef((props, ref) => {
    const [pageState, setPageState] = useState(null);
    const opacityAnimated = useRef(new Animated.Value(0));

    useLayoutEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', _onBackPress);
        return () => {
            backHandler?.remove?.();
        };
    }, [pageState?.component]);

    const _onBackPress = useCallback(() => {
        const isShowing = !!pageState?.component;
        isShowing && hide();
        return isShowing; //disable back of navigation
    }, [pageState?.component]);

    const show = ({ component, cancelHandler }) => {
        setPageState({
            component,
            cancelHandler,
        });
        Animated.timing(opacityAnimated.current, {
            toValue: 1,
            duration: DURATION,
            useNativeDriver: true,
        }).start();
    };

    const hide = () => {
        Animated.timing(opacityAnimated.current, {
            toValue: 0,
            duration: DURATION,
            useNativeDriver: true,
        }).start(() => {
            pageState?.cancelHandler?.();
            setPageState(null);
        });
    };

    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    if (!pageState?.component) return null;

    return (
        <Animated.View style={styles.container} opacity={opacityAnimated.current}>
            <TouchableOpacity style={styles.touch_area} onPress={hide} />
            {pageState?.component}
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background_dark,
    },
    touch_area: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
});

export default deepMemo(AppOverlay);
