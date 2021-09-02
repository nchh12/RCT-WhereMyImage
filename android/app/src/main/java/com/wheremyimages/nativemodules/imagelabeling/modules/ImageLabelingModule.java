package com.wheremyimages.nativemodules.imagelabeling.modules;

import android.Manifest;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.wheremyimages.nativemodules.imagelabeling.utils.EmitterInterface;
import com.wheremyimages.nativemodules.imagelabeling.utils.ImageProcessor;
import com.wheremyimages.nativemodules.permission.popup.OnHandleClickCta;
import com.wheremyimages.nativemodules.permission.popup.PopupView;
import com.wheremyimages.nativemodules.permission.utils.PermissionConstants;
import com.wheremyimages.nativemodules.permission.utils.PermissionHelper;

import java.util.ArrayList;
import java.util.List;

public class ImageLabelingModule extends ReactContextBaseJavaModule {
    public static String EVENT_EMITTER_KEY = "IMAGE_LABELING_LISTENER_KEY";
    public static String MODULE_NAME = "ImageLabelingModule";
    private ReactApplicationContext RCTContext;
    private ImageProcessor imageProcessor;

    public ImageLabelingModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        RCTContext = reactContext;
        this.imageProcessor = new ImageProcessor(new EmitterInterface() {
            @Override
            public void emitToJs(WritableMap map, String event) {
                map.putString("status", event);
                sendEvent(map);
            }
        });
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void startScaningWithFilter(ReadableArray inputFilters) {
        List<String> listFilters = new ArrayList<>();
        for (int i = 0; i < inputFilters.size(); i++) {
            listFilters.add(inputFilters.getString(i));
        }
        imageProcessor.addFilters(listFilters);
        imageProcessor.startProcessing(RCTContext.getCurrentActivity(), true);
    }

    @ReactMethod
    public void stopScanning() {
        imageProcessor.stopProcessing();
    }


    @ReactMethod
    public void requestPermission(Promise promise) {
        PermissionHelper.requestPermission(getCurrentActivity(), Manifest.permission.READ_EXTERNAL_STORAGE, promise);
    }

    @ReactMethod
    public void checkPermission(Promise promise) {
        PermissionHelper.checkPermission(getCurrentActivity(), Manifest.permission.READ_EXTERNAL_STORAGE, promise);
    }

    @ReactMethod
    public void grantPermission(Promise promise) {
        String result = PermissionHelper.checkPermission(
                getCurrentActivity(),
                Manifest.permission.READ_EXTERNAL_STORAGE
        );
        if (result != PermissionConstants.GRANTED) {
            PopupView permissionView = new PopupView(getReactApplicationContext(), new OnHandleClickCta() {
                @Override
                public void onClickCta() {
                    PermissionHelper.requestPermission(getCurrentActivity(), Manifest.permission.READ_EXTERNAL_STORAGE, promise);
                }
            });
            permissionView.show();
        } else {
            promise.resolve(result);
        }
    }

    void sendEvent(@Nullable WritableMap params) {
        RCTContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(EVENT_EMITTER_KEY, params);
    }
}
