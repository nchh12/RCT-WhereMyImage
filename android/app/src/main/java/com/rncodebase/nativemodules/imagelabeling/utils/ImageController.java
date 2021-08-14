package com.rncodebase.nativemodules.imagelabeling.utils;

import com.facebook.react.bridge.WritableMap;

public interface ImageController {
    void readyToSendImageLabel(WritableMap map);
}
