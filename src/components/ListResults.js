import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useFilters, useLabelmages } from '@hooks';
import LottieView from 'lottie-react-native';
import Strings from '@utils/Strings';
import assets from '@assets';
import { CustomizedText, FilterItem } from '@components';
import SharedStyles from '@utils/SharedStyles';
import ImageLabeling from '@core/nativemodules/ImageLabeling';
import { DefaultSize } from '@utils/Constants';
import Colors from '@utils/Colors';
import { deepMemo } from 'use-hook-kits';

const ListResults = () => {
    const { getImagesEmitted, removeListenerEmitting, addListenerEmitting, startScaning } =
        useLabelmages();
    const { getListLabels } = useFilters();
    const [endIndex, setEndIndex] = useState(3);
    const imagesEmitted = getImagesEmitted();

    useEffect(() => {
        addListenerEmitting();
        startScaning(getListLabels());
        return () => {
            removeListenerEmitting();
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

        return textResult + '\n' + Strings.wannaContinue;
    };

    const _renderHeader = () => (
        <TouchableOpacity
            onPress={() => {
                startScaning(getListLabels());
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
    const { isInEnableLabels } = useFilters();
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

    const onPressItem = () => {
        // refAppOverlay.current?.show({
        //     component: () => {
        //         return <ItemResult item={item} />;
        //     },
        // });
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
                                    disable={!isInEnableLabels(label.toLowerCase())}
                                />
                            </View>
                        );
                    }}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={_renderFooter}
                />
            </View>
            <CustomizedText type="header" textStyle={styles.result_text}>
                {index}
            </CustomizedText>
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
        borderTopRightRadius: DefaultSize.M,
        borderTopLeftRadius: DefaultSize.M,
    },
    result_text: {
        color: Colors.dark,
        marginHorizontal: DefaultSize.XL,
    },
    footer_list_result: {
        width: 100,
        height: 100,
        alignSelf: 'center',
    },
});

export default deepMemo(ListResults);

const mock = [
    {
        labels: {
            BUMPER: 0.5603411197662354,
            CUISINE: 0.8649705648422241,
            CUTLERY: 0.5061919093132019,
            FLOWER: 0.691242516040802,
            FOOD: 0.9440395832061768,
            MEAL: 0.6500492691993713,
            METAL: 0.5485353469848633,
            PLANT: 0.5006673336029053,
            TABLEWARE: 0.6769270896911621,
            VEGETABLE: 0.5139994621276855,
        },
        pixelHeight: 4160,
        pixelWidth: 3120,
        status: 'onResponse',
        uri: 'file:///storage/9016-4EF8/DCIM/Camera/IMG_20190913_105255.jpg',
    },
    {
        labels: {
            CHAIR: 0.5206753611564636,
            EVENT: 0.5844243168830872,
            FOOD: 0.5037615895271301,
            FUN: 0.7481051683425903,
            LEISURE: 0.8382639288902283,
            PLANT: 0.51252281665802,
            SITTING: 0.8482508063316345,
            SMILE: 0.5797609090805054,
            TABLEWARE: 0.582424521446228,
            UMBRELLA: 0.6405924558639526,
            VACATION: 0.6058626770973206,
        },
        pixelHeight: 1280,
        pixelWidth: 720,
        status: 'onResponse',
        uri: 'file:///storage/emulated/0/DCIM/Screenshots/Screenshot_2021-05-27-00-48-47-566_com.facebook.katana.png',
    },
    {
        labels: {
            CUISINE: 0.8307254314422607,
            FLOWER: 0.5869677662849426,
            FOOD: 0.910401463508606,
            MEAL: 0.6979391574859619,
            VEGETABLE: 0.527787983417511,
        },
        pixelHeight: 1280,
        pixelWidth: 720,
        status: 'onResponse',
        uri: 'file:///storage/emulated/0/DCIM/Screenshots/Screenshot_2021-06-05-02-26-09-490_com.instagram.android.png',
    },
    {
        labels: {
            CUISINE: 0.8307254314422607,
            FLOWER: 0.5869677662849426,
            FOOD: 0.910401463508606,
            MEAL: 0.6979391574859619,
            VEGETABLE: 0.527787983417511,
        },
        pixelHeight: 1280,
        pixelWidth: 720,
        status: 'onResponse',
        uri: 'file:///storage/emulated/0/DCIM/Screenshots/Screenshot_2021-06-05-02-26-09-490_com.instagram.android.png',
    },
    {
        labels: {
            CUISINE: 0.8307254314422607,
            FLOWER: 0.5869677662849426,
            FOOD: 0.910401463508606,
            MEAL: 0.6979391574859619,
            VEGETABLE: 0.527787983417511,
        },
        pixelHeight: 1280,
        pixelWidth: 720,
        status: 'onResponse',
        uri: 'file:///storage/emulated/0/DCIM/Screenshots/Screenshot_2021-06-05-02-26-09-490_com.instagram.android.png',
    },
    {
        labels: {
            CUISINE: 0.8307254314422607,
            FLOWER: 0.5869677662849426,
            FOOD: 0.910401463508606,
            MEAL: 0.6979391574859619,
            VEGETABLE: 0.527787983417511,
        },
        pixelHeight: 1280,
        pixelWidth: 720,
        status: 'onResponse',
        uri: 'file:///storage/emulated/0/DCIM/Screenshots/Screenshot_2021-06-05-02-26-09-490_com.instagram.android.png',
    },
    {
        labels: {
            CUISINE: 0.8307254314422607,
            FLOWER: 0.5869677662849426,
            FOOD: 0.910401463508606,
            MEAL: 0.6979391574859619,
            VEGETABLE: 0.527787983417511,
        },
        pixelHeight: 1280,
        pixelWidth: 720,
        status: 'onResponse',
        uri: 'file:///storage/emulated/0/DCIM/Screenshots/Screenshot_2021-06-05-02-26-09-490_com.instagram.android.png',
    },
    {
        labels: {
            CUISINE: 0.8307254314422607,
            FLOWER: 0.5869677662849426,
            FOOD: 0.910401463508606,
            MEAL: 0.6979391574859619,
            VEGETABLE: 0.527787983417511,
        },
        pixelHeight: 1280,
        pixelWidth: 720,
        status: 'onResponse',
        uri: 'file:///storage/emulated/0/DCIM/Screenshots/Screenshot_2021-06-05-02-26-09-490_com.instagram.android.png',
    },
    {
        labels: {
            CUISINE: 0.8307254314422607,
            FLOWER: 0.5869677662849426,
            FOOD: 0.910401463508606,
            MEAL: 0.6979391574859619,
            VEGETABLE: 0.527787983417511,
        },
        pixelHeight: 1280,
        pixelWidth: 720,
        status: 'onResponse',
        uri: 'file:///storage/emulated/0/DCIM/Screenshots/Screenshot_2021-06-05-02-26-09-490_com.instagram.android.png',
    },
    {
        labels: {
            CUISINE: 0.8307254314422607,
            FLOWER: 0.5869677662849426,
            FOOD: 0.910401463508606,
            MEAL: 0.6979391574859619,
            VEGETABLE: 0.527787983417511,
        },
        pixelHeight: 1280,
        pixelWidth: 720,
        status: 'onResponse',
        uri: 'file:///storage/emulated/0/DCIM/Screenshots/Screenshot_2021-06-05-02-26-09-490_com.instagram.android.png',
    },
    {
        labels: {
            CUISINE: 0.8307254314422607,
            FLOWER: 0.5869677662849426,
            FOOD: 0.910401463508606,
            MEAL: 0.6979391574859619,
            VEGETABLE: 0.527787983417511,
        },
        pixelHeight: 1280,
        pixelWidth: 720,
        status: 'onResponse',
        uri: 'file:///storage/emulated/0/DCIM/Screenshots/Screenshot_2021-06-05-02-26-09-490_com.instagram.android.png',
    },
];
