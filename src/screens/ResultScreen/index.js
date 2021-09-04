import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useLabelmages } from '@hooks';
import Strings from '@utils/Strings';
import assets from '@assets';
import { CustomizedText, CustomizedContainer, AnimatedHeader } from '@components';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { DefaultSize } from '@utils/Constants';
import DeviceConfigs from '@utils/DeviceConfigs';
import { deepMemo } from 'use-hook-kits';
import ListResults from './ListResults';

const ResultScreen = ({ navigation }) => {
    const refHeader = useRef(null);
    const { getProgressEmitted } = useLabelmages();

    useEffect(() => {}, []);

    const onScroll = e => {
        const offsetY = e.nativeEvent.contentOffset.y;
        refHeader.current?.setOpacity(Math.min(1, offsetY / (DeviceConfigs.height * 0.1)));
    };

    const _renderBelowView = () => (
        <View style={styles.container_below}>
            <CustomizedText type={'giant'}>
                <CustomizedText type={'header'}>scanned </CustomizedText>
                {getProgressEmitted()?.percent || 0}%
                <CustomizedText type={'header'}> of album</CustomizedText>
            </CustomizedText>
        </View>
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
            </View>
            <Footer />
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

const Footer = deepMemo(() => (
    <View style={styles.container_footer}>
        <LottieView
            source={assets.analyzing}
            style={styles.img_footer}
            autoPlay={true}
            loop={true}
        />
        <CustomizedText type={'place_holder'}>{Strings.footer}</CustomizedText>
    </View>
));

const styles = StyleSheet.create({
    container_scrollview: {
        width: '100%',
    },
    img_footer: {
        width: '80%',
        height: 'auto',
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: -DefaultSize.XL * 1.5,
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
        paddingVertical: DefaultSize.XL,
        backgroundColor: Colors.white,
    },
    container_below: {
        width: '100%',
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
});

export default deepMemo(ResultScreen);
