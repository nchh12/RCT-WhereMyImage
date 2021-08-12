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
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.label.ImageLabel;
import com.google.mlkit.vision.label.ImageLabeler;
import com.google.mlkit.vision.label.ImageLabeling;
import com.google.mlkit.vision.label.defaults.ImageLabelerOptions;
import com.rncodebase.helpers.GalleryHelper;
import com.rncodebase.utilities.BitmapUtils;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.TimeUnit;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.schedulers.Schedulers;

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

    Test buffer = new Test();


    @ReactMethod
    public void stopNotify(){
        buffer.flagStop = true;
    }

    @ReactMethod
    public void startNotify() {

        List<String> list = GalleryHelper.fetchGalleryImages(RCTContext.getCurrentActivity());
        buffer.flagStop = false;


        Observable.just(1)
                .subscribeOn(Schedulers.newThread())
                .subscribe(item -> {
                    int index = 0;

                    while (true){
//                        Log.d("@@@ new loop", index +"");
                        if (index >= list.size() || buffer.flagStop){
                            break;
                        }
                        if (buffer.isProcessing) {
                            continue;
                        }

                        buffer.isProcessing = true;

                        buffer.imageUrl = list.get(index++);
                        Log.d("@@@ start process", buffer.imageUrl);
                        buffer.bitmap = BitmapUtils.loadBitmap(buffer.imageUrl);
                        if (buffer.bitmap == null) {
                            buffer.isProcessing = false;
                            continue;
                        }

                        ImageLabeler labeler = ImageLabeling.getClient(ImageLabelerOptions.DEFAULT_OPTIONS);
                        labeler.process(InputImage.fromBitmap(buffer.bitmap, 0))
                                .addOnSuccessListener((listLabels) -> {
                                    WritableMap mapLabel = Arguments.createMap();
                                    for (ImageLabel label : listLabels) {
                                        mapLabel.putDouble(label.getText(), label.getConfidence());
                                        Log.d("@@", label.getText());
                                    }
                                    WritableMap map = Arguments.createMap();
                                    map.putString("uri", buffer.imageUrl);
                                    map.putInt("pixelWidth", buffer.bitmap.getWidth());
                                    map.putInt("pixelHeight", buffer.bitmap.getHeight());
                                    map.putMap("label", mapLabel);
                                    sendEvent(map);
                                    Log.d("@@@ end process", buffer.imageUrl);
                                    buffer.isProcessing = false;
                                });

                    }
                });
    }


    void sendEvent(@Nullable WritableMap params) {
        RCTContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(TestModule.EVENT_NAME, params);
    }
}

class Test{
    int cnt = 0;
    Bitmap bitmap;
    String imageUrl;
    boolean isProcessing;
    boolean flagStop = false;
}