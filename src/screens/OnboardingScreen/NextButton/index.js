import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Image } from 'react-native';
import styles from './styles';
import Svg, { G, Circle } from 'react-native-svg';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/AntDesign';

const NextButton = ({ percentage, scrollTo }) => {
    const size = 96;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);

    const animation = toValue => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        animation(percentage);
    }, [percentage]);

    useEffect(() => {
        progressAnimation.addListener(
            value => {
                const strokeDaskoffset = circumference - (circumference * value.value) / 100;

                if (progressRef?.current) {
                    progressRef.current.setNativeProps({
                        strokeDaskoffset,
                    });
                }
            },
            [percentage]
        );

        return () => {
            progressAnimation.removeAllListeners();
        };
    }, []);

    return (
        <View style={[styles.container]}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={center}>
                    <Circle
                        stroke="#E6E7E8"
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        ref={progressRef}
                        stroke="#F4338F"
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                    />
                </G>
            </Svg>
            <TouchableOpacity onPress={scrollTo} style={styles.button} activeOpacity={0.6}>
                <Image source={Icon.getImageSource('arrowright', 32, '#fff')}></Image>
            </TouchableOpacity>
        </View>
    );
};

export default NextButton;
