import React, { useState, useRef, memo, useLayoutEffect } from 'react';
import { View, FlatList, Animated, Modal } from 'react-native';
import styles from './styles';
import slides from './slides';
import OnboardingItem from './OnboardingItem';
import Paginator from './Paginator';
import NextButton from './NextButton';
import { KEY_STORAGE, getItem } from '@utils/StorageUtils';

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

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            setVisible(false);
        }
    };

    if (!visible) return null;

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
                <NextButton
                    scrollTo={scrollTo}
                    percentage={(currentIndex + 1) * (100 / slides.length)}
                />
            </View>
        </Modal>
    );
};

export default memo(OnboardingScreen);
