import { DeviceEventEmitter, NativeEventEmitter, NativeModules } from 'react-native';

/** Include MoMoChatModule */
const { ImageLabelingModule } = NativeModules || {};
const ImageLabelingEmitter = new NativeEventEmitter(ImageLabelingModule);

export default class Listener {
    static instance = null;
    static listener = {};
    static events = {};
    static EVENTS = {
        ON_IMAGE_LABELING: 'onImageLabeling',
    };

    constructor() {}

    static getInstance() {
        if (!this.instance) {
            this.instance = new Listener();
        }
        return this.instance;
    }

    static pushEvent(event, data) {
        this.listener[event]?.forEach(element => {
            data ? element(data) : element();
        });
    }

    static listen(params, callback) {
        console.log('add listener', params);
        // Push call back
        let event = params;
        if (typeof params === 'object' && params.event) {
            event = params.event;
        }

        const callbacks = this.listener[event] || [];
        callbacks.push(callback);
        this.listener[event] = callbacks;

        //---------------------------------------------------------------------------//
        // Listen event from native event
        if (this.listener[event] && this.listener[event].length === 1) {
            let removeListener;
            switch (event) {
                case Listener.EVENTS.ON_IMAGE_LABELING:
                    removeListener = () => {
                        const eventName = 'IMAGE_LABELING_LISTENER_KEY';
                        const emitter = ImageLabelingEmitter.addListener(eventName, result => {
                            this.pushEvent(event, result);
                        });
                        return () => {
                            emitter.remove();
                        };
                    };
                    break;
                default:
                    removeListener = () => {
                        const emitter = DeviceEventEmitter.addListener(event, result => {
                            this.pushEvent(event, result);
                        });
                        return () => {
                            emitter.remove();
                        };
                    };
                    break;
            }
            // save event to remove
            removeListener && (this.events[event] = removeListener());
        }

        return () => {
            this.removeCallback(event, callback);
        };
    }

    static removeCallback(event, callback) {
        console.log('remove listener', event);
        if (this.listener[event]) {
            this.listener[event] = this.listener[event].filter(item => item !== callback);
        }

        if (
            this.listener[event] &&
            this.listener[event].length === 0 &&
            typeof this.events[event] === 'function'
        ) {
            this.events[event]();
            delete this.listener[event];
        }
    }
}
