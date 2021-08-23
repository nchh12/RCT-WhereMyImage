import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { useLabelmages, useFilters } from '@hooks';
import Strings from '@utils/Strings';
import assets from '@assets';
import { CustomizedText, CustomizedContainer, AnimatedHeader, ListResults } from '@components';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { DefaultSize } from '@utils/Constants';
import DeviceConfigs from '@utils/DeviceConfigs';
import { deepMemo } from 'use-hook-kits';

const ResultScreen = ({ navigation }) => {
    const { startScaning } = useLabelmages();
    const { getListLabels } = useFilters();
    const refHeader = useRef(null);

    useEffect(() => {
        startScaning(getListLabels());
    }, []);

    const onScroll = e => {
        const offsetY = e.nativeEvent.contentOffset.y;
        refHeader.current?.setOpacity(Math.min(1, offsetY / (DeviceConfigs.height * 0.1)));
    };

    const _renderFooter = () => (
        <View style={styles.container_footer}>
            <CustomizedText type={'place_holder'}>{Strings.footer}</CustomizedText>
        </View>
    );

    const _renderBelowView = () => (
        <LottieView
            source={assets.analyzing}
            style={styles.img_header}
            autoPlay={true}
            loop={true}
        />
    );

    const _renderOverlayScrollView = () => (
        <ScrollView
            style={styles.container_scrollview}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            scrollEnabled
        >
            <View style={{ height: DeviceConfigs.height * 0.3 }} />
            <View style={styles.container_result}>
                <ListResults />
                {_renderFooter()}
            </View>
        </ScrollView>
    );

    return (
        <CustomizedContainer type="main_screen">
            <AnimatedHeader
                ref={refHeader}
                navigation={navigation}
                title={Strings.processing_header}
            />
            {_renderBelowView()}
            {_renderOverlayScrollView()}
        </CustomizedContainer>
    );
};

const styles = StyleSheet.create({
    container_scrollview: {
        flex: 1,
        width: '100%',
    },
    img_header: {
        width: '90%',
        height: 'auto',
        alignSelf: 'center',
        position: 'absolute',
    },
    container_result: {
        minHeight: DeviceConfigs.height * 0.7,
        paddingTop: DefaultSize.XL,
        borderTopRightRadius: DefaultSize.XL,
        borderTopLeftRadius: DefaultSize.XL,
        backgroundColor: Colors.white,
    },
    container_footer: {
        alignItems: 'center',
        marginBottom: DefaultSize.XL,
    },
});

export default deepMemo(ResultScreen);
