package com.rncodebase.nativemodules.splash;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;

public class SplashInstance {
    private static SplashView instance = null;

    private SplashInstance(){}

    public static SplashView getInstance(@NonNull Activity activity) {
        if (instance == null)
            instance = new SplashView(activity);
        return instance;
    }
}
