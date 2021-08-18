import React, { memo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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

const ProcessingScreen = ({ navigation }) => {
    const { getListLabels } = useFilters();
    const refHeader = useRef(null);

    useEffect(() => {
        ImageLabeling.startScaningWithFilter(getListLabels() || []);
        refAppOverlay.current?.show({
            component: Loading,
        });
    }, []);

    const onScroll = e => {
        const offsetY = e.nativeEvent.contentOffset.y;
        refHeader.current?.setOpacity(Math.min(1, offsetY / (DeviceConfigs.height * 0.1)));
    };

    return (
        <CustomizedContainer type="main_screen">
            <AnimatedHeader ref={refHeader} navigation={navigation} />
            <ScrollView
                style={styles.container}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <LottieView
                    source={assets.analyzing}
                    style={styles.img_header}
                    autoPlay={true}
                    loop={true}
                />
                <View style={styles.container_result}>
                    <CustomizedText type="title">{Strings.cancel}</CustomizedText>

                    <ListResults />
                </View>
            </ScrollView>
        </CustomizedContainer>
    );
};

const Loading = () => (
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
                ImageLabeling.stopScanning();
                refAppOverlay.current?.hide();
            }}
        >
            <CustomizedContainer type={'peach'} containerStyle={SharedStyles.bar}>
                <CustomizedText type="title">{Strings.cancel}</CustomizedText>
            </CustomizedContainer>
        </TouchableOpacity>
    </>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    img_header: {
        width: '90%',
        height: 'auto',
        alignSelf: 'center',
    },
    container_result: {
        height: DeviceConfigs.height,
        paddingTop: DefaultSize.XL,
        borderTopRightRadius: DefaultSize.XL,
        borderTopLeftRadius: DefaultSize.XL,
        backgroundColor: Colors.white,
    },
});

export default memo(ProcessingScreen);
