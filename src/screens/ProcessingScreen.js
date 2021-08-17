import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    NativeModules,
    Image,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { useSelector, keySelector, useDispatch, actions } from '../context';
import LottieView from 'lottie-react-native';
import Listener from '@utils/Listener';
import LinearGradient from 'react-native-linear-gradient';
const { ImageLabelingModule } = NativeModules || {};

const ProcessingScreen = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
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
        </LinearGradient>
    );
};

const TestList = React.memo(() => {
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

export default ProcessingScreen;
