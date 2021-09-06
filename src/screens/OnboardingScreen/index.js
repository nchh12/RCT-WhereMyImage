import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Animated, Button } from 'react-native';
import styles from './styles';
import slides from './slides';
import OnboardingItem from './OnboardingItem';
import Paginator from './Paginator';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

const OnboardingScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            console.log('Last item');
        }
    };

    const skip = () => {
        slidesRef.current.scrollToIndex({ index: slides.length - 1 });
    };

    return (
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
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <Paginator data={slides} scrollX={scrollX} />
            <View style={styles.buttons}>
                <TouchableOpacity onPress={skip}>
                    <Text style={styles.skip_text}> Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={scrollTo}>
                    <Text style={styles.next_text}> Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OnboardingScreen;
