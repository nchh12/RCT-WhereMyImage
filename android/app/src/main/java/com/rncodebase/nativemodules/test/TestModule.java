package com.rncodebase.nativemodules.test;

import android.os.Handler;
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
    public int add(int a, int b){
        return a + b;
    }

    @ReactMethod
    public void testMap(Callback callback){
        WritableMap map = Arguments.createMap();
        map.putString("11", "1111");
        map.putInt("22",2222);
        callback.invoke(map);
    }

    @ReactMethod
    public void startNotify(){
        Log.d("@@", "start delay");
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Log.d("@@@", "start send");
                testMap(new Callback() {
                    @Override
                    public void invoke(Object... args) {
                        sendEvent((WritableMap) args[0]);
                    }
                });
            }
        }, 6000);
    }

    void sendEvent(@Nullable WritableMap params) {
        RCTContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(TestModule.EVENT_NAME, params);
    }
}
