package com.wheremyimages.nativemodules.splash;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SplashModule extends ReactContextBaseJavaModule {

    public static String MODULE_NAME = "SplashModule";

    public SplashModule(ReactApplicationContext reactContext) {
        super((reactContext));
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void show(){
        SplashInstance.getInstance(getCurrentActivity()).show();
    }

    @ReactMethod
    public void hide(){
        getCurrentActivity().runOnUiThread(() -> {
            SplashInstance.getInstance(getCurrentActivity()).hide();
        });
    }
}
