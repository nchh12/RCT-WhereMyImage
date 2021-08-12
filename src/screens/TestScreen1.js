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
const { TestModule } = NativeModules;

const TestEmitter = new NativeEventEmitter(TestModule);

const TestScreen1 = ({ navigation }) => {
    const dispatch = useDispatch();
    const testVariable = useSelector(keySelector.testVariable);
    const [image, setImage] = React.useState([]);

    React.useEffect(() => {
        console.log(TestModule);
        TestEmitter.addListener('TEST_MODULE_KEY', res => {
            console.log(JSON.stringify(res, null, 2));
            setImage(image => [...[res], ...image]);
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
                    TestModule?.startNotify();
                }}
            >
                <Text>test</Text>
            </TouchableOpacity>
            <LottieView
                source={require('../assets/test.json')}
                autoPlay
                loop
                style={{ width: 100, height: 100 }}
            />
            <TouchableOpacity
                onPress={() => {
                    TestModule?.stopNotify();
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
