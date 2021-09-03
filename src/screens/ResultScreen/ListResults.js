import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useFilters, useLabelmages } from '@hooks';
import LottieView from 'lottie-react-native';
import Strings from '@utils/Strings';
import assets from '@assets';
import { CustomizedText, FilterItem, ImageDetail } from '@components';
import SharedStyles from '@utils/SharedStyles';
import { DefaultSize, TextSize } from '@utils/Constants';
import Colors from '@utils/Colors';
import { deepMemo } from 'use-hook-kits';
import { refAppOverlay } from '@navigation/AppOverlay';

const ListResults = () => {
    const {
        removeListenerEmitting,
        addListenerEmitting,
        getProgressEmitted,
        getImagesEmitted,
        grantPermission,
        startScaning,
        clearResults,
    } = useLabelmages();

    const { getParseLabels, setParseLabels } = useFilters();
    const listParseLabels = getParseLabels();

    const [endIndex, setEndIndex] = useState(3);
    const imagesEmitted = getImagesEmitted();
    // const imagesEmitted = require('./mock').default;
    const isDone = getProgressEmitted() >= 100;

    useEffect(() => {
        addListenerEmitting();
        return () => {
            removeListenerEmitting();
        };
    }, []);

    useEffect(() => {
        grantPermission(() => {
            startScaning(listParseLabels);
        });
        return () => {
            clearResults();
            setParseLabels([]);
        };
    }, []);

    const _isLoadedAll = () => {
        return endIndex >= imagesEmitted?.length;
    };

    const _renderItem = ({ item, index }) => <ItemResult item={item} index={index} />;

    const _renderFooter = () => {
        return (
            <View style={styles.container_list}>
                <LottieView
                    source={!_isLoadedAll() ? assets.loading_circle : assets.end_sign}
                    style={styles.footer_list_result}
                    autoPlay={true}
                    loop={true}
                    speed={2}
                />
            </View>
        );
    };

    const _getTextHeader = () => {
        const textResult =
            Strings.foundNImages.replace(`%n`, `${imagesEmitted?.length || 0}`) +
            (imagesEmitted?.length > 1 ? 's' : '');

        return textResult + (!isDone ? `\n${Strings.wannaContinue}` : '');
    };

    const _renderHeader = () => (
        <TouchableOpacity
            onPress={() => {
                !isDone && startScaning(listParseLabels, false);
            }}
        >
            <CustomizedText type="header" textStyle={styles.result_text}>
                {_getTextHeader()}
            </CustomizedText>
        </TouchableOpacity>
    );

    const _renderListEmitted = () => {
        if (!imagesEmitted?.length) return null;
        return (
            <>
                <FlatList
                    horizontal
                    contentContainerStyle={styles.container_list}
                    data={imagesEmitted.slice(0, endIndex)}
                    renderItem={_renderItem}
                    ListFooterComponent={_renderFooter}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) =>
                        `key_${item?.uri} ${item?.pixelWidth} ${imagesEmitted?.length - index}`
                    }
                    onEndReached={() => {
                        if (!_isLoadedAll()) {
                            setEndIndex(endIndex => endIndex + 5);
                        }
                    }}
                    onEndReachedThreshold={0.2}
                />
            </>
        );
    };

    return (
        <View style={styles.container}>
            {_renderHeader()}
            {_renderListEmitted()}
        </View>
    );
};

const ItemResult = deepMemo(({ item, index }) => {
    const { uri = '', pixelWidth = 0, pixelHeight = 1, labels = {} } = item || {};
    const { checkLabels } = useFilters();
    const { isEnableLabels } = checkLabels();
    const aspectRatio = 1; //Math.max(0.8, pixelWidth / pixelHeight);
    const listLabels = Object.keys(labels)
        .map(key => {
            return {
                label: key,
                percent: parseInt((labels[key] || 0) * 100),
            };
        })
        .sort((a, b) => a.percent < b.percent);

    const _renderFooter = () => {
        return <View style={styles.item_img}></View>;
    };

    const _renderHeader = () => (
        <CustomizedText type="header" textStyle={styles.header_tag}>
            {index + 1}
        </CustomizedText>
    );

    const onPressItem = () => {
        refAppOverlay.current?.show({
            component: <ImageDetail item={item} />,
        });
    };

    return (
        <TouchableOpacity style={styles.container_item} activeOpacity={0.8} onPress={onPressItem}>
            <Image source={{ uri }} style={[styles.item_img, { aspectRatio }]} />
            <View style={styles.container_filter}>
                <FlatList
                    data={listLabels}
                    keyExtractor={(item, index) => `key_filter_${uri}_${item?.label}_${index}`}
                    renderItem={({ item }) => {
                        const { label, percent } = item;
                        return (
                            <View style={styles.item_filter}>
                                <FilterItem
                                    text={`#${label?.toLowerCase()}: ${percent}%`}
                                    disable={!isEnableLabels(label.toLowerCase())}
                                />
                            </View>
                        );
                    }}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={_renderFooter}
                    ListHeaderComponent={_renderHeader}
                />
            </View>
            {/* <CustomizedText type="item" textStyle={styles.result_text}>
                {index}/{getNameFromPath(uri)}
            </CustomizedText> */}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container_list: {
        paddingHorizontal: DefaultSize.L,
        alignItems: 'center',
    },
    container_item: {
        marginTop: DefaultSize.L,
        ...SharedStyles.shadow,
        height: '100%',
        marginHorizontal: DefaultSize.S,
        backgroundColor: Colors.white,
        borderRadius: DefaultSize.M,
    },
    container_filter: {
        flex: 1,
        position: 'absolute',
        top: 0,
        height: '80%',
        alignSelf: 'flex-end',
        borderRadius: DefaultSize.S,
        backgroundColor: '#ffffff90',
    },
    item_filter: {
        alignSelf: 'flex-end',
    },
    item_img: {
        alignSelf: 'center',
        width: 'auto',
        height: '80%',
        borderRadius: DefaultSize.M,
    },
    result_text: {
        color: Colors.dark,
        marginHorizontal: DefaultSize.XL,
    },
    header_tag: {
        alignSelf: 'flex-end',
        marginRight: DefaultSize.S,
        fontSize: TextSize.H1,
    },
    footer_list_result: {
        width: 100,
        height: 100,
        alignSelf: 'center',
    },
});

export default deepMemo(ListResults);
