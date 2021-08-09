import React from 'react';
import { View, Text, TouchableOpacity, NativeModules } from 'react-native';
import { TestScreen2 } from './index';
import { useSelector, keySelector, useDispatch, actions } from '../context';
import LottieView from 'lottie-react-native';
const { TestModule } = NativeModules;

const TestScreen1 = ({ navigation }) => {
    const dispatch = useDispatch();
    const testVariable = useSelector(keySelector.testVariable);

    React.useEffect(() => {
        console.log('test', TestModule.add(1, 2));

        TestModule.testMap(res => {
            console.log('res', res);
        });
        // TestModule.add(1, 2, res => {
        //     console.log(res);
        // });
        // TestModule.labelImage(
        //     'https://scontent.fsgn5-1.fna.fbcdn.net/v/t1.6435-9/223563036_384408286397202_7257421653677010635_n.jpg?_nc_cat=101&ccb=1-3&_nc_sid=730e14&_nc_ohc=SS0iBTyEyMYAX-0WrGF&_nc_ht=scontent.fsgn5-1.fna&oh=6eff84e126f0330fde7102686c6b119e&oe=61307B04',
        //     res => {
        //         console.log(JSON.stringify(res, null, 2));
        //     }
        // );
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
                    navigation.push('TestScreen2');
                }}
            >
                <Text>Go to screen 2</Text>
            </TouchableOpacity>
            <Text>{testVariable}</Text>
            <TouchableOpacity
                onPress={() => {
                    actions.setTestVariable({ dispatch, payload: testVariable + 1 });
                }}
            >
                <Text>inc test variable</Text>
            </TouchableOpacity>
            <LottieView
                source={require('../assets/test.json')}
                autoPlay
                loop
                style={{ width: 100, height: 100 }}
            />
        </View>
    );
};

export default TestScreen1;
