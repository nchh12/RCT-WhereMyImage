package com.wheremyimages.nativemodules.permission.modules;

import android.Manifest;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.PermissionListener;
import com.wheremyimages.nativemodules.permission.utils.PermissionConstants;
import com.wheremyimages.nativemodules.permission.utils.PermissionHelper;

import java.util.Map;

public class PermissionModule extends ReactContextBaseJavaModule {
    public static String MODULE_NAME = "PermissionModule";

    public PermissionModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return super.getConstants();
    }

    @ReactMethod
    public void checkPermission(final String permission, final Promise promise) {
        PermissionHelper.checkPermission(getCurrentActivity(), permission, promise);
    }

    @ReactMethod
    public void requestPermission(final String permission, final Promise promise) {
        PermissionHelper.requestPermission(getCurrentActivity(), permission, promise);
    }

    @ReactMethod
    public void openSettings(){
        PermissionHelper.openSettings(getReactApplicationContext());
    }
}