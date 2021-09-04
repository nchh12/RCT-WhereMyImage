import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image, FlatList, ScrollView } from 'react-native';
import Strings from '@utils/Strings';
import { CustomizedText, CustomizedContainer, FilterItem } from '@components';
import { deepMemo } from 'use-hook-kits';
import { DefaultSize } from '@utils/Constants';
import { useFilters } from '@hooks';
import Colors from '@utils/Colors';
import { refAppOverlay } from '@navigation/AppOverlay';
import DeviceConfigs from '@utils/DeviceConfigs';
import Share from 'react-native-share';

const ImageDetail = ({ item }) => {
    const { uri = '', pixelWidth = 0, pixelHeight = 0, labels = {} } = item || {};
    const aspectRatio = (pixelWidth + 0.1) / (pixelHeight + 0.1);
    const { checkLabels } = useFilters();
    const { isEnableLabels } = checkLabels();
    const listLabels = Object.keys(labels)
        .map(key => {
            return {
                label: key,
                percent: parseInt((labels[key] || 0) * 100),
            };
        })
        .sort((a, b) => a.percent < b.percent);

    const _renderScrollImage = () => (
        <ScrollView
            bounces={false}
            style={styles.container_img}
            showsVerticalScrollIndicator={true}
        >
            <Image source={{ uri }} style={[{ aspectRatio }, styles.item_img]} />
        </ScrollView>
    );

    const _renderListFilters = () => (
        <FlatList
            data={listLabels}
            style={styles.container_filter}
            keyExtractor={(item, index) => `key_filter_${uri}_${item?.label}_${index}`}
            renderItem={({ item }) => {
                const { label, percent } = item;
                return (
                    <View>
                        <FilterItem
                            text={`#${label?.toLowerCase()}: ${percent}%`}
                            disable={!isEnableLabels(label.toLowerCase())}
                        />
                    </View>
                );
            }}
            scrollEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );

    const _renderCtaShare = () => (
        <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.7}
            onPress={() => {
                Share.open({
                    url: uri,
                })
                    .then(res => {
                        console.log('res', res);
                    })
                    .catch(error => {
                        console.log('error', error);
                    });
            }}
        >
            <CustomizedText type="item">{Strings.share}</CustomizedText>
        </TouchableOpacity>
    );

    const _renderCtaCancel = () => (
        <TouchableOpacity
            style={styles.cta_cancel}
            activeOpacity={0.7}
            onPress={() => {
                refAppOverlay.current?.hide();
            }}
        >
            <CustomizedText type="place_holder">{Strings.cancel}</CustomizedText>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {_renderScrollImage()}
            {_renderListFilters()}
            <>
                {_renderCtaShare()}
                {_renderCtaCancel()}
            </>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        height: 'auto',
        justifyContent: 'space-between',
        maxHeight: DeviceConfigs.height * 0.8,
        borderRadius: DefaultSize.M,
        backgroundColor: Colors.white,
        paddingBottom: DefaultSize.L,
    },
    container_img: {
        maxHeight: '70%',
        height: 'auto',
    },
    container_filter: {},
    cta: {
        marginTop: DefaultSize.XL,
        alignItems: 'center',
        marginHorizontal: DefaultSize.XL,
        paddingHorizontal: DefaultSize.XL,
        paddingVertical: DefaultSize.M,
        borderRadius: DefaultSize.S,
        backgroundColor: Colors.base_2,
    },
    cta_cancel: {
        alignSelf: 'center',
        marginHorizontal: DefaultSize.XL,
        paddingHorizontal: DefaultSize.XL,
        paddingVertical: DefaultSize.M,
        borderRadius: DefaultSize.S,
        backgroundColor: 'transparent',
    },
    item_img: {
        alignSelf: 'center',
        width: '100%',
        height: 'auto',
        resizeMode: 'cover',
        borderTopLeftRadius: DefaultSize.M,
        borderTopRightRadius: DefaultSize.M,
    },
});

export default deepMemo(ImageDetail);
