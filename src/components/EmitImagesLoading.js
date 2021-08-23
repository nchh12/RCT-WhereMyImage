import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import Strings from '@utils/Strings';
import assets from '@assets';
import { CustomizedText, CustomizedContainer } from '@components';
import { deepMemo } from 'use-hook-kits';
import ImageLabeling from '@core/nativemodules/ImageLabeling';
import { DefaultSize } from '@utils/Constants';

const EmitImagesLoading = deepMemo(() => (
    <>
        <LottieView
            source={assets.image_processing}
            style={styles.img}
            autoPlay={true}
            loop={true}
        />
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
                ImageLabeling.stopScanning();
            }}
        >
            <CustomizedContainer type={'peach'} containerStyle={styles.cta}>
                <CustomizedText type="item">{Strings.cancel}</CustomizedText>
            </CustomizedContainer>
        </TouchableOpacity>
    </>
));

const styles = StyleSheet.create({
    img: {
        width: '100%',
        height: 'auto',
    },
    cta: {
        paddingHorizontal: DefaultSize.XL,
        paddingVertical: DefaultSize.M,
        borderRadius: DefaultSize.S,
    },
});

export default deepMemo(EmitImagesLoading);
