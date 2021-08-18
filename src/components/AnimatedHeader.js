import React, { useLayoutEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { TextSize } from '@utils/Constants';
import Colors from '@utils/Colors';
import { useHeaderHeight } from '@react-navigation/stack';

const AnimatedHeader = ({ navigation = null, onScroll = () => {} }) => {
    const headerHeight = useRef(useHeaderHeight()).current;
    const opacityAnimated = useRef(new Animated.Value(0));

    useLayoutEffect(() => {
        navigation?.setOptions?.({
            headerShown: false,
        });

        console.log(headerHeight);
    }, []);

    return (
        <Animated.View style={[styles.container, { height: headerHeight || 40 }]}></Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        // backgroundColor: 'red',
    },
});

export default React.memo(AnimatedHeader);
