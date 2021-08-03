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
        TestModule.add(1, 2, res => {
            console.log(res);
        });
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
