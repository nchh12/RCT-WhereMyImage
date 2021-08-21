import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFilters } from '@hooks';
import Strings from '@utils/Strings';
import { refAppOverlay } from '@navigation/AppOverlay';
import assets from '@assets';
import { CustomizedText, CustomizedContainer, AnimatedHeader, ListResults } from '@components';
import SharedStyles from '@utils/SharedStyles';
import ImageLabeling from '../core/nativemodules/ImageLabeling';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { DefaultSize } from '@utils/Constants';
import DeviceConfigs from '@utils/DeviceConfigs';
import { deepMemo } from 'use-hook-kits';

const ProcessingScreen = ({ navigation }) => {
    const { getListLabels } = useFilters();
    const refHeader = useRef(null);

    useEffect(() => {
        ImageLabeling.startScaningWithFilter(getListLabels() || []);
        refAppOverlay.current?.show({
            component: <Loading />,
        });
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

    const _renderResetButton = () => (
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
            <CustomizedContainer type="peach" containerStyle={SharedStyles.bar}>
                <CustomizedText type="item" size={16}>
                    Restart
                </CustomizedText>
            </CustomizedContainer>
        </TouchableOpacity>
    );

    return (
        <CustomizedContainer type="main_screen">
            <AnimatedHeader
                ref={refHeader}
                navigation={navigation}
                title={Strings.processing_header}
            />
            <ScrollView
                style={styles.container}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                scrollEnabled
            >
                <LottieView
                    source={assets.analyzing}
                    style={styles.img_header}
                    autoPlay={true}
                    loop={true}
                />
                <View style={styles.container_result}>
                    <ListResults />
                    {/* {_renderResetButton()} */}
                    {_renderFooter()}
                </View>
            </ScrollView>
        </CustomizedContainer>
    );
};

const Loading = deepMemo(() => (
    <>
        <LottieView
            source={assets.image_processing}
            style={{
                width: '100%',
                height: 'auto',
            }}
            autoPlay={true}
            loop={true}
        />
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
                console.log('stop here');
                ImageLabeling.stopScanning();
                refAppOverlay?.current?.hide();
            }}
        >
            <CustomizedContainer type={'peach'} containerStyle={SharedStyles.bar}>
                <CustomizedText type="item">{Strings.cancel}</CustomizedText>
            </CustomizedContainer>
        </TouchableOpacity>
    </>
));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        // backgroundColor: Colors.white,
    },
    img_header: {
        width: '90%',
        height: 'auto',
        alignSelf: 'center',
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

export default deepMemo(ProcessingScreen);
