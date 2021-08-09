import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    NativeModules,
    Image,
    ScrollView,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { TestScreen2 } from './index';
import { useSelector, keySelector, useDispatch, actions } from '../context';
import LottieView from 'lottie-react-native';
import Listener from '@utils/Listener';
const { ImageLabelingModule } = NativeModules || {};

const TestScreen1 = ({ navigation }) => {
    const dispatch = useDispatch();
    const testVariable = useSelector(keySelector.testVariable);

    //still be blocked UI?

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
        >
            <LottieView
                source={require('../assets/test.json')}
                style={{
                    width: '90%',
                    height: 100,
                }}
                autoPlay={true}
                loop={true}
            />
            <TouchableOpacity
                onPress={() => {
                    console.log('test here');
                }}
            >
                <Text>test</Text>
                <ActivityIndicator />
            </TouchableOpacity>
            <TestList />
        </View>
    );
};

const TestList = React.memo(() => {
    const [image, setImage] = React.useState([]);

    React.useEffect(() => {
        Listener.listen(Listener.EVENTS.ON_IMAGE_LABELING, res => {
            console.log(JSON.stringify(res, null, 2));
            setImage(image => [...[res], ...image]);
        });

        startScan();

        return () => {
            Listener.removeCallback(Listener.EVENTS.ON_IMAGE_LABELING);
        };
    }, []);

    const startScan = async () => {
        ImageLabelingModule.startScaningWithFilter(['cat']);
    };

    return (
        <FlatList
            data={image}
            keyExtractor={(item, index) => `key_${item?.uri} ${item?.pixelWidth} ${index}`}
            renderItem={({ item }) => {
                return (
                    <Image
                        source={{ uri: item?.uriThumnail }}
                        style={{
                            alignSelf: 'center',
                            width: '80%',
                            height: 'auto',
                            aspectRatio: item?.pixelWidth / item?.pixelHeight,
                            marginTop: 100,
                        }}
                    />
                );
            }}
        />
    );
});

export default TestScreen1;
