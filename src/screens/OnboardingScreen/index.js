import React, { useState, useRef, useLayoutEffect, memo } from 'react';
import { View, Text, FlatList, Animated, Modal, TouchableOpacity } from 'react-native';
import styles from './styles';
import slides from './slides';
import OnboardingItem from './OnboardingItem';
import Paginator from './Paginator';
import { KEY_STORAGE, getItem, setItem } from '@utils/StorageUtils';

const OnboardingScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    useLayoutEffect(() => {
        getItem(KEY_STORAGE.ONBOARDING_SHOW, res => {
            setVisible(!res);
        });
    }, []);

    const _hideOnboarding = () => {
        setVisible(false);
        setItem(KEY_STORAGE.ONBOARDING_SHOW, 'showed');
    };

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            _hideOnboarding();
        }
    };

    const skip = () => {
        slidesRef.current.scrollToIndex({ index: slides.length - 1 });
    };

    return (
        <Modal animationType={'slide'} visible={visible} transparent={true}>
            <View style={styles.container}>
                <View style={{ flex: 3 }}>
                    <FlatList
                        data={slides}
                        renderItem={({ item }) => <OnboardingItem item={item} />}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        bounces={false}
                        keyExtractor={item => item.id}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            {
                                useNativeDriver: false,
                            }
                        )}
                        scrollEventThrottle={32}
                        onViewableItemsChanged={viewableItemsChanged}
                        viewabilityConfig={viewConfig}
                        ref={slidesRef}
                    />
                </View>
                <Paginator data={slides} scrollX={scrollX} />
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity onPress={skip}>
                    <Text style={styles.skip_text}>{slides?.[currentIndex]?.ctaLeft}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={scrollTo}>
                    <Text style={styles.next_text}>{slides?.[currentIndex]?.ctaRight}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default memo(OnboardingScreen);
