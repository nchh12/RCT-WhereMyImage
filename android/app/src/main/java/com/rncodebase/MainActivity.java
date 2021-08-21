package com.rncodebase;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.rncodebase.nativemodules.splash.SplashInstance;
import com.rncodebase.nativemodules.splash.SplashModule;
import com.rncodebase.nativemodules.splash.SplashView;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "RNCodeBase";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    SplashInstance.getInstance(this).show();
  }
}
