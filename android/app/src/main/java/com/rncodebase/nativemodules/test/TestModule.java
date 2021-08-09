package com.rncodebase.nativemodules.test;

import android.graphics.Bitmap;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.label.ImageLabel;
import com.google.mlkit.vision.label.ImageLabeler;
import com.google.mlkit.vision.label.ImageLabeling;
import com.google.mlkit.vision.label.defaults.ImageLabelerOptions;
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
        for (int i = list.size() - 10; i < list.size(); i++) {
            String imageUrl = list.get(i);

            Bitmap bitmap = BitmapUtils.loadBitmap(imageUrl);
            WritableMap map = Arguments.createMap();

            ImageLabeler labeler = ImageLabeling.getClient(ImageLabelerOptions.DEFAULT_OPTIONS);
            labeler.process(InputImage.fromBitmap(bitmap, 0))
                    .addOnSuccessListener((listLabels) -> {
                        WritableMap mapLabel = Arguments.createMap();
                        for (ImageLabel label : listLabels) {
                            mapLabel.putDouble(label.getText(), label.getConfidence());
                            Log.d("@@", label.getText());
                        }
                        map.putString("uri", imageUrl);
                        map.putInt("pixelWidth", bitmap.getWidth());
                        map.putInt("pixelHeight", bitmap.getHeight());
                        map.putMap("label", mapLabel);
                        sendEvent(map);
                    });
        }
    }


    void sendEvent(@Nullable WritableMap params) {
        RCTContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(TestModule.EVENT_NAME, params);
    }
}
