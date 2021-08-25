import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image, FlatList } from 'react-native';
import Strings from '@utils/Strings';
import assets from '@assets';
import { CustomizedText, CustomizedContainer, FilterItem } from '@components';
import { deepMemo } from 'use-hook-kits';
import { DefaultSize } from '@utils/Constants';
import { useFilters, useLabelmages } from '@hooks';
import Colors from '@utils/Colors';
import { refAppOverlay } from '@navigation/AppOverlay';
import DeviceConfigs from '@utils/DeviceConfigs';

const ImageDetail = ({ item }) => {
    console.log(JSON.stringify(item, null, 2));
    const { uri = '', pixelWidth = 0, pixelHeight = 0, labels = {} } = item || {};
    const aspectRatio = (pixelWidth + 0.1) / (pixelHeight + 0.1);
    const { isInEnableLabels } = useFilters();
    const listLabels = Object.keys(labels)
        .map(key => {
            return {
                label: key,
                percent: parseInt((labels[key] || 0) * 100),
            };
        })
        .sort((a, b) => a.percent < b.percent);

    return (
        <View style={styles.container}>
            <Image source={{ uri }} style={[styles.item_img, { aspectRatio }]} />
            <FlatList
                data={listLabels}
                keyExtractor={(item, index) => `key_filter_${uri}_${item?.label}_${index}`}
                renderItem={({ item }) => {
                    const { label, percent } = item;
                    return (
                        <FilterItem
                            text={`#${label?.toLowerCase()}: ${percent}%`}
                            disable={!isInEnableLabels(label.toLowerCase())}
                        />
                    );
                }}
                scrollEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    refAppOverlay.current?.hide();
                }}
            >
                <CustomizedContainer type={'peach'} containerStyle={styles.cta}>
                    <CustomizedText type="item">{Strings.share}</CustomizedText>
                </CustomizedContainer>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    refAppOverlay.current?.hide();
                }}
                style={styles.cta_cancel}
            >
                <CustomizedText type="place_holder">{Strings.cancel}</CustomizedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 'auto',
        maxHeight: DeviceConfigs.height * 0.9,
        borderRadius: DefaultSize.M,
        backgroundColor: Colors.white,
        paddingBottom: DefaultSize.L,
    },
    cta: {
        width: '90%',
        alignSelf: 'center',
        paddingHorizontal: DefaultSize.XL,
        paddingVertical: DefaultSize.M,
        borderRadius: DefaultSize.S,
    },
    cta_cancel: {
        width: '90%',
        alignSelf: 'center',
        paddingHorizontal: DefaultSize.XL,
        paddingVertical: DefaultSize.M,
        borderRadius: DefaultSize.S,
        backgroundColor: ['transparent', 'transparent'],
    },
    item_img: {
        alignSelf: 'center',
        width: '100%',
        height: 'auto',
        maxHeight: DeviceConfigs.height * 0.9,
        borderTopLeftRadius: DefaultSize.M,
        borderTopRightRadius: DefaultSize.M,
    },
});

export default deepMemo(ImageDetail);
