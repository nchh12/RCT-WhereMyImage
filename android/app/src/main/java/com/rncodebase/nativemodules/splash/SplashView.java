package com.rncodebase.nativemodules.splash;

import android.app.Dialog;
import android.content.Context;
import android.view.View;
import androidx.annotation.NonNull;

import com.rncodebase.R;

public class SplashView extends Dialog {
    public SplashView(@NonNull Context context) {
        super(context, R.style.SplashScreen_Fullscreen);
    }

    @Override
    public void show() {
        setContentView(View.inflate(getContext(), R.layout.splash_view, null));
        super.show();
    }

    @Override
    public void dismiss(){
        if (super.isShowing() == true){
            super.dismiss();
        }
    }
}