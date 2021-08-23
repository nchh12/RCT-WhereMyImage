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
    const [component, setComponent] = useState(false);
    const opacityAnimated = useRef(new Animated.Value(0));

    useLayoutEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', _onBackPress);
        return () => {
            backHandler?.remove?.();
        };
    }, [component]);

    const _onBackPress = useCallback(() => {
        const isShowing = component !== null;
        isShowing && hide();
        return isShowing; //disable back of navigation
    }, [component]);

    const show = ({ component }) => {
        setComponent(component);
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
            setComponent(null);
        });
    };

    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    if (!component) return null;

    return (
        <Animated.View style={styles.container} opacity={opacityAnimated.current}>
            <TouchableOpacity style={styles.touch_area} onPress={hide} />
            {component}
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
