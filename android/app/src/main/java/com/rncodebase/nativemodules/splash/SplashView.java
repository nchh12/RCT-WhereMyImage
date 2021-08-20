package com.rncodebase.nativemodules.splash;

import android.app.Dialog;
import android.content.Context;
import android.os.Handler;
import android.view.View;

import androidx.annotation.NonNull;

import com.rncodebase.R;

public class SplashView extends Dialog {
    public static int DEFAULT_DURATION = 10000;

    public SplashView(@NonNull Context context) {
        super(context, R.style.SplashScreen_Fullscreen);
    }

    @Override
    public void show() {
        setContentView(View.inflate(getContext(), R.layout.splash_view, null));
        super.show();

//        new Handler().postDelayed(new Runnable() {
//            @Override
//            public void run() {
//                SplashView.super.dismiss();
//            }
//        }, DEFAULT_DURATION);

        new Handler().postDelayed(() -> {
            SplashView.super.dismiss();
        }, DEFAULT_DURATION);
    }
}
