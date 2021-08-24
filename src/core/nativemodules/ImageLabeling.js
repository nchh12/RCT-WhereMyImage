import { NativeModules, NativeEventEmitter } from 'react-native';

const { ImageLabelingModule, PermissionModule } = NativeModules || {};
const ImageLabelingEmitter = new NativeEventEmitter(ImageLabelingModule);
const {
    startScaningWithFilter,
    stopScanning,
    checkPermission,
    requestPermission,
    grantPermission,
} = ImageLabelingModule;

const { openSettings } = PermissionModule || {};

const LISTENER_KEY = 'IMAGE_LABELING_LISTENER_KEY';
const listen = callback => {
    return ImageLabelingEmitter.addListener(LISTENER_KEY, result => {
        callback?.(result);
    });
};

export default {
    startScaningWithFilter,
    requestPermission,
    checkPermission,
    grantPermission,
    openSettings,
    stopScanning,
    listen,
};
