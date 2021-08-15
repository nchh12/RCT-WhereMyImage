import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    NativeModules,
    Image,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { TestScreen2 } from './index';
import { useSelector, keySelector, useDispatch, actions } from '../context';
import LottieView from 'lottie-react-native';
import Listener from '@utils/Listener';
const { ImageLabelingModule } = NativeModules || {};

const TestScreen1 = ({ navigation }) => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
            }}
        >
            <LottieView
                source={require('../assets/searching.json')}
                style={{
                    width: '90%',
                    height: 100,
                }}
                autoPlay={true}
                loop={true}
            />
            <View
                style={{
                    width: '100%',
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        ImageLabelingModule.startScaningWithFilter(['screenshot']);
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
            <TestList />
        </View>
    );
};

const TestList = React.memo(() => {
    const [image, setImage] = React.useState([]);

    React.useEffect(() => {
        Listener.listen(Listener.EVENTS.ON_IMAGE_LABELING, res => {
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
                            height: '50%',
                            aspectRatio: item?.pixelWidth / item?.pixelHeight,
                            marginLeft: 100,
                        }}
                    />
                );
            }}
        />
    );
});

export default TestScreen1;
