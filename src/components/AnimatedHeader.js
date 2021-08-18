import React, { useLayoutEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Animated, Text } from 'react-native';
import { TextSize } from '@utils/Constants';
import Colors from '@utils/Colors';
import { useHeaderHeight } from '@react-navigation/stack';
import ShareStyles from '@utils/SharedStyles';

const AnimatedHeader = forwardRef((props, ref) => {
    const { navigation } = props;
    const headerHeight = useRef(useHeaderHeight()).current;
    const opacityAnimated = useRef(new Animated.Value(0)).current;

    useLayoutEffect(() => {
        navigation?.setOptions?.({
            headerShown: false,
        });
    }, []);

    const setOpacity = value => {
        console.log(value, headerHeight);
        opacityAnimated.setValue(value);
    };

    useImperativeHandle(ref, () => ({
        setOpacity,
    }));

    return (
        <Animated.View
            style={[styles.container, { height: headerHeight || 0, opacity: opacityAnimated }]}
        >
            <Text>aregar</Text>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        ...ShareStyles.shadow,
        position: 'absolute',
        width: '100%',
        backgroundColor: Colors.white,
        zIndex: 10,
    },
});

export default AnimatedHeader;
