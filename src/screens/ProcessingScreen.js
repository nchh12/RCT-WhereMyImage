import React, { useLayoutEffect, memo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    NativeModules,
    Image,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useFilters } from '@hooks';
import Listener from '@utils/Listener';
import LinearGradient from 'react-native-linear-gradient';
import Strings from '@utils/Strings';
import { refAppOverlay } from '@navigation/AppOverlay';
import assets from '@assets';
import { CustomizedText, CustomizedContainer } from '@components';
import SharedStyles from '@utils/SharedStyles';

const { ImageLabelingModule } = NativeModules || {};

const ProcessingScreen = ({ navigation }) => {
    const { getListLabels } = useFilters();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: Strings.processing_header,
            headerStyle: {
                backgroundColor: '#F1EAB9',
                elevation: 1,
            },
        });
    }, []);

    return (
        <LinearGradient
            style={[
                {
                    flex: 1,
                    backgroundColor: 'white',
                    alignItems: 'center',
                },
            ]}
            colors={['#f1eab9', '#ff8c8c']}
            locations={[0, 0.5]}
        >
            <View
                style={{
                    width: '100%',
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        // ImageLabelingModules.startScaningWithFilter(['screenshot']);
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
                        ImageLabelingModule.stopScanning();
                    }}
                >
                    <Text>stop</Text>
                    <ActivityIndicator />
                </TouchableOpacity>
            </View>
            <ListResult />
        </LinearGradient>
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
                ImageLabelingModule.stopScanning();
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
        Listener.listen(Listener.EVENTS.ON_IMAGE_LABELING, res => {
            switch (res?.status) {
                case 'onResponse':
                    console.log(JSON.stringify(res, null, 2));
                    setImage(image => [...[res], ...image]);
                    break;
                case 'onFinish':
                    console.log('DONEEEE');
                    break;
            }
        });

        return () => {
            Listener.removeCallback(Listener.EVENTS.ON_IMAGE_LABELING);
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
