package com.rncodebase.nativemodules.imagelabeling.utils;

import com.facebook.react.bridge.WritableMap;

public interface EmitterInterface {
    void emitToJs(WritableMap map, String event);
}
