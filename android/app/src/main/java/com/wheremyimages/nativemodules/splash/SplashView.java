package com.wheremyimages.nativemodules.splash;

import android.app.Dialog;
import android.content.Context;
import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;

import com.wheremyimages.R;

public class SplashView extends Dialog {
    public SplashView(@NonNull Context context) {
        super(context, R.style.SplashScreen_Fullscreen);
    }

    @Override
    public void show() {
        setContentView(View.inflate(getContext(), R.layout.splash_view, null));

        try {
            super.show();
        } catch (Exception e) {
            Log.d("@@@ on error", e.getMessage());
        }
    }

    @Override
    public void dismiss() {
        if (super.isShowing() == true) {
            super.dismiss();
        }
    }
}