import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    NativeModules,
    NativeEventEmitter,
    FlatList,
    Image,
} from 'react-native';
import { TestScreen2 } from './index';
import { useSelector, keySelector, useDispatch, actions } from '../context';
import LottieView from 'lottie-react-native';
const { TestModule, ImageLabelingModule } = NativeModules;

const ImageLabelingEmitter = new NativeEventEmitter(ImageLabelingModule);

const TestScreen1 = ({ navigation }) => {
    const dispatch = useDispatch();
    const testVariable = useSelector(keySelector.testVariable);
    const [image, setImage] = React.useState([]);

    React.useEffect(() => {
        console.log(ImageLabelingModule);
        ImageLabelingEmitter.addListener('IMAGE_LABELING_LISTENER_KEY', res => {
            switch (res?.event) {
                case 'onResult':
                    console.log(JSON.stringify(res, null, 2));
                    setImage(image => [...[res], ...image]);
                    break;
                case 'onStatus':
                    console.log('DONEEEE');
                    break;
            }
        });

        //
    }, []);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <TouchableOpacity
                onPress={() => {
                    ImageLabelingModule?.startScanningOnFilters(['Laugh']);
                    setImage([]);
                }}
            >
                <Text>test</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    ImageLabelingModule?.startScanningOnFilters(['Sunglasses']);
                    setImage([]);
                }}
            >
                <Text>teaegaegraegeaegegaergagagrraeeagegaest</Text>
            </TouchableOpacity>
            <LottieView
                source={require('../assets/test.json')}
                autoPlay
                loop
                style={{ width: 100, height: 100 }}
            />
            <TouchableOpacity
                onPress={() => {
                    ImageLabelingModule?.stopScanning();
                }}
            >
                <Text>stop</Text>
            </TouchableOpacity>
            <FlatList
                data={image}
                keyExtractor={(item, index) => `key_${item}_${index}`}
                renderItem={({ item }) => {
                    const { uri, pixelWidth, pixelHeight } = item;
                    return (
                        <Image
                            source={{ uri: item.uri }}
                            style={{
                                width: '90%',
                                height: 'auto',
                                aspectRatio: pixelWidth / pixelHeight,

                                marginTop: 100,
                            }}
                        />
                    );
                }}
            />
        </View>
    );
};

export default TestScreen1;
