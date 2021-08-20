import { NativeModules, NativeEventEmitter } from 'react-native';

const { ImageLabelingModule } = NativeModules || {};
const ImageLabelingEmitter = new NativeEventEmitter(ImageLabelingModule);
const { startScaningWithFilter, stopScanning } = ImageLabelingModule;

const LISTENER_KEY = 'IMAGE_LABELING_LISTENER_KEY';
const listen = callback => {
    return ImageLabelingEmitter.addListener(LISTENER_KEY, result => {
        callback?.(result);
    });
};

export default {
    startScaningWithFilter,
    stopScanning,
    listen,
};
