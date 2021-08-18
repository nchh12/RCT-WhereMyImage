import React, { useLayoutEffect, memo } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFilters } from '@hooks';
import Strings from '@utils/Strings';
import { refAppOverlay } from '@navigation/AppOverlay';
import assets from '@assets';
import { CustomizedText, CustomizedContainer, AnimatedHeader } from '@components';
import SharedStyles from '@utils/SharedStyles';
import ImageLabeling from '../core/nativemodules/ImageLabeling';

const ProcessingScreen = ({ navigation }) => {
    const { getListLabels } = useFilters();

    return (
        <CustomizedContainer type="main_screen">
            <AnimatedHeader navigation={navigation} />
            <View
                style={{
                    width: '100%',
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        ImageLabeling.startScaningWithFilter(['FUN']);
                        refAppOverlay.current?.show({
                            component: Loading,
                        });
                    }}
                >
                    <Text>test</Text>
                    <ActivityIndicator />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        ImageLabeling.stopScanning();
                    }}
                >
                    <Text>stop</Text>
                    <ActivityIndicator />
                </TouchableOpacity>
            </View>
            <ListResult />
        </CustomizedContainer>
    );
};

const Loading = () => (
    <>
        <LottieView
            source={assets.load_seeking}
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
            <CustomizedContainer type={'gray'} containerStyle={SharedStyles.bar}>
                <CustomizedText type="title">{Strings.cancel}</CustomizedText>
            </CustomizedContainer>
        </TouchableOpacity>
    </>
);

const ListResult = React.memo(() => {
    const [image, setImage] = React.useState([]);

    React.useEffect(() => {
        const listener = ImageLabeling.listen(res => {
            switch (res?.status) {
                case 'onResponse':
                    console.log(JSON.stringify(res, null, 2));
                    setImage(image => [...[res], ...image]);
                    break;
                case 'onFinish':
                    console.log('DONEEEE');
                    refAppOverlay?.current?.hide();
                    break;
            }
        });

        return () => {
            listener.remove();
        };
    }, []);

    return (
        <FlatList
            data={image}
            keyExtractor={(item, index) => `key_${item?.uri} ${item?.pixelWidth} ${index}`}
            horizontal
            renderItem={({ item }) => {
                return (
                    <Image
                        source={{ uri: item?.uri }}
                        style={{
                            alignSelf: 'center',
                            width: 'auto',
                            height: '30%',
                            aspectRatio: item?.pixelWidth / item?.pixelHeight,
                            marginLeft: 20,
                        }}
                    />
                );
            }}
        />
    );
});

export default memo(ProcessingScreen);
