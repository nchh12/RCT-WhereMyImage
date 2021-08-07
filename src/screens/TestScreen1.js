import React from 'react';
import { View, Text, TouchableOpacity, NativeModules, Image, ScrollView } from 'react-native';
import { TestScreen2 } from './index';
import { useSelector, keySelector, useDispatch, actions } from '../context';
import LottieView from 'lottie-react-native';
import Listener from '@utils/Listener';
const { ImageLabelingModule } = NativeModules || {};

const TestScreen1 = ({ navigation }) => {
    const dispatch = useDispatch();
    const testVariable = useSelector(keySelector.testVariable);
    const cnt = React.useRef(1);

    const [image, setImage] = React.useState([]);

    React.useEffect(() => {
        Listener.listen({ event: Listener.EVENTS.ON_IMAGE_LABELING }, res => {
            cnt.current = cnt.current + 1;
            const newList = [...[res], ...image];
            console.log(res, image.length + ' ' + newList.length);

            setImage(image => [...[res], ...image]);
        });

        ImageLabelingModule.startScaningWithFilter([]);

        return () => {
            Listener.removeCallback(Listener.EVENTS.ON_IMAGE_LABELING);
        };
    }, []);

    console.log(image.length);

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
        >
            {image.map(item => {
                return (
                    <Image
                        key={`key_${item?.uri} ${item?.pixelWidth}`}
                        source={{ uri: item?.uri }}
                        style={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: item?.pixelWidth / item?.pixelHeight,
                            marginTop: 100,
                        }}
                    />
                );
            })}
        </ScrollView>
    );
};

export default TestScreen1;
