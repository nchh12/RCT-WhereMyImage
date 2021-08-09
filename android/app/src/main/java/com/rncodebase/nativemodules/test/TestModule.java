package com.rncodebase.nativemodules.test;

import android.graphics.Bitmap;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.rncodebase.helpers.GalleryHelper;
import com.rncodebase.utilities.BitmapUtils;

import java.util.List;
import java.util.Map;

public class TestModule extends ReactContextBaseJavaModule {
    public static String EVENT_NAME = "TEST_MODULE_KEY";
    static ReactApplicationContext RCTContext;

    public TestModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        RCTContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "TestModule";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return super.getConstants();
    }

    @ReactMethod
    public int add(int a, int b) {
        return a + b;
    }

    @ReactMethod
    public void testMap(Callback callback) {
        WritableMap map = Arguments.createMap();
        map.putString("11", "1111");
        map.putInt("22", 2222);
        callback.invoke(map);
    }

    @ReactMethod
    public void startNotify() {

        List<String> list = GalleryHelper.fetchGalleryImages(RCTContext.getCurrentActivity());
        for (int i = list.size() - 20; i < list.size(); i++) {
            String imageUrl = list.get(i);

            Bitmap bitmap = BitmapUtils.loadBitmap(imageUrl);

            WritableMap map = Arguments.createMap();
            map.putString("uri", imageUrl);
            map.putInt("pixelWidth", bitmap.getWidth());
            map.putInt("pixelHeight", bitmap.getHeight());
            sendEvent(map);
        }
    }


    void sendEvent(@Nullable WritableMap params) {
        RCTContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(TestModule.EVENT_NAME, params);
    }
}
