import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import Strings from '@utils/Strings';
import { refAppOverlay } from '@navigation/AppOverlay';
import assets from '@assets';
import { CustomizedText, CustomizedContainer } from '@components';
import SharedStyles from '@utils/SharedStyles';
import { deepMemo } from 'use-hook-kits';

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
    img: {
        width: '100%',
        height: 'auto',
    },
});

export default deepMemo(EmitImagesLoading);
